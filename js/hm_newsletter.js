/**
 * Extend Number functions and add pad function to
 * allow leading zeros.
 */
Number.prototype.pad = function (size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

(function ($, Drupal, window, document) {
  /**
   * Harbourmaster Newsletter object.
   * @constructor
   */
  function HmNewsletter(context) {
    this.$wrapper = $('#hm-newsletter-subscribe', context);
    this.$perms = this.$wrapper.find('.hm_newsletter__permissions');
    this.$form = this.$wrapper.find('form');
    this.$alerts = this.$wrapper.find('.hm_newsletter__alerts');
    this.$success = this.$wrapper.find('.hm_newsletter__success');
    this.$error = this.$wrapper.find('.hm_newsletter__error');
  }

  // Global list of possible fields.
  HmNewsletter.fields = {
    salutation: null,
    firstname: null,
    lastname: null,
    postalcode: null,
    city: null,
    dateofbirth: null,
    email: null,
  };

  /**
   * Bind clicks on more-links accordion-like behaviour.
   */
  HmNewsletter.prototype.bindMoreLinks = function () {
    var $thisObj = this;
    // Open more text div.
    $('.hm_newsletter__permissions').find('.text-hidden-toggle').once().on('click', function (e) {
      // Click should no affect label checkbox.
      e.preventDefault();
      if (!$(this).hasClass('visible')) {
        $(this).addClass('visible').text('ausblenden');
        $('#' + $(this).data('toggle')).show();
      }
      else {
        $(this).removeClass('visible').text('mehr');
        $('#' + $(this).data('toggle')).hide();
      }
    });
  };

  /**
   * Submit function for newsletter
   */
  HmNewsletter.prototype.bindSubmit = function () {

    var $thisObj = this;
    this.$form.on('submit', $.proxy(function (pEvent) {

      // On submission we remove old alerts.
      $thisObj.removeAlerts();

      var valid = true;
      var user = {};

      // Get userdata from fields.
      $.each(HmNewsletter.fields, function (index) {
        var field = $thisObj.formField(index);
        // Get the value from the field, if it exists.
        if (field.length) {
          var val = field.val();
          user[index] = val;
          // When the field is required, the value must not be empty.
          if (val === '' && field.attr('required')) {
            $thisObj.addAlert('danger', index, 'Das Feld ist erforderlich.');
            valid = false;
          }
          // Check for valid email address.
          var regex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
          if ((index == 'email' && val.length > 0) && !regex.test(val)) {
            $thisObj.addAlert('danger', index,
              'Bitte überprüfen Sie die Eingabe der E-Mail Adresse.');
            valid = false;
          }
        }
      });

      // Get groups from form.
      var groups = [];
      $thisObj.$form.find('[name="groups[]"]:checked').each(function () {
        groups.push($(this).val());
      });

      // Validate on selected newsletter - disabled to allow
      // sending form only subscribing to agreements.
      /*
       if (groups.length == 0) {
       $thisObj.addAlert('danger', 'groups[]', 'Bitte wählen Sie mindestens einen Newsletter aus.');
       }*/

      // Get day of birth from form and reformat data.
      var dob_day = parseInt($thisObj.$form.find('[name="dob_day').val());
      var dob_month = parseInt($thisObj.$form.find('[name="dob_month').val());
      var dob_year = parseInt($thisObj.$form.find('[name="dob_year').val());
      if (dob_day > 0 && dob_month > 0 && dob_year > 0) {
        user.dateofbirth = dob_year + '-' + (dob_month).pad() + '-' + (dob_day).pad();
      }

      // Build data for newsletter subscriptions - split up by clients/ groups.
      var client_groups = [];
      $.each(groups, function (index, value) {
        var group_data = value.split('_');
        if (group_data.length == 2) {
          if (client_groups[group_data[0]] === undefined) {
            client_groups[group_data[0]] = [];
          }
          client_groups[group_data[0]].push(group_data[1]);
        }
      });

      // Get client_id.
      var client_id = $thisObj.$form.find('[name="client_id"]').val();

      // Check if agreements where checked.
      var agreements = [];

      // Agreements.
      var $promo_permissions = $thisObj.$form.find('[name="promo_permission"]');
      jQuery.each($promo_permissions, function (index, elem) {
        if($(elem).is(':checked') === true) {
          var agreement = {
            "version": $(elem).data('version'),
            "name": $(elem).data('name')
          };
          agreements.push(agreement);
        }
      });

      // We only send request if groups or agreements are passed.
      if (valid && agreements.length === 0 && client_groups.length === 0) {
        $thisObj.addAlert('danger', 'promo_permission',
          'Bitte bestätigen Sie die Datenschutzeinwilligung.');
        valid = false;
      }

      // Send subscribe request with newsletters.
      if (valid && client_groups.length) {
        var data = {};
        // Send request for every client and it's subscribed groups.
        client_groups.forEach(function (value, index, arr) {
          data.client = index;
          data.groups = value;
          data.user = user;
          data.agreements = [];
          $thisObj.sendSubscribeRequest(data);
        });
        $thisObj.scrollPage();
      }

      // Send subscribe request for agreements..
      if (valid && agreements.length) {
        var data = {};
        data.client = parseInt(client_id);
        data.groups = [];
        data.user = user;
        data.agreements = agreements;
        $thisObj.sendSubscribeRequest(data);
        $thisObj.scrollPage();
      }
      return false;
    }, this));
  };

  /**
   * Scroll up page to actual form.
   */
  HmNewsletter.prototype.scrollPage = function () {
    var $thisObj = this;
    // Scroll page up to newsletter form.
    $('html, body').animate({
      scrollTop: 0
    }, 200);
  };

  /**
   * Adds alert to the newsletter form's alert section.
   *
   * @param type
   * @param field
   * @param message
   */
  HmNewsletter.prototype.addAlert = function (type, field, message) {

    // Mark field as error.
    if (type == 'danger' && field !== undefined) {
      this.setValidationState(this.formField(field), 'has-error');
    }
    var alertString = '<div class="alert alert-' + type + '" role="alert">' + message + '</div>';
    // Check if alertString already exists.
    var alertshtml = this.$alerts.html();
    if (alertshtml.indexOf(alertString) == -1) {
      this.$alerts.append(alertString);
    }
  };

  /**
   * Adds alert to the newsletter form's alert section.
   *
   * @param el
   * @param state
   */
  HmNewsletter.prototype.setValidationState = function (el, state) {
    el.parents('.form-group').addClass(state);
  };


  /**
   * Removes all alerts from the newsletter form allert section.
   */
  HmNewsletter.prototype.removeAlerts = function () {
    this.$alerts.html('');
    this.$form.find('.form-group').removeClass('has-error');
  };

  /**
   * Get the given form field.
   *
   * @param {string} field
   * @returns {*}
   */
  HmNewsletter.prototype.formField = function (field) {
    return this.$form.find('[name="' + field + '"]');
  };


  /**
   * Show success after subscribing to newsletter.
   */
  HmNewsletter.prototype.showSuccess = function () {
    var $thisObj = this;
    // Reset complete form.
    this.$form.trigger("reset");
    this.$form.hide();
    this.$success.show();
  };

  /**
   * Show error after failed subscribtion to newsletter.
   */
  HmNewsletter.prototype.showError = function () {
    var $thisObj = this;
    // Reset complete form.
    this.$form.trigger("reset");
    this.$form.hide();
    this.$error.show();
  };

  /**
   * Sends subscribe request with given data.
   * @param data
   */
  HmNewsletter.prototype.sendSubscribeRequest = function (data) {
    var $thisObj = this;
    window.thsixtyQ.push(['newsletter.subscribe', {
      params: data,
      success: function () {
        $thisObj.showSuccess();
      },
      error: function (err) {
        $thisObj.showError();
      }
    }]);
  };

  /**
   * Get permission text from API.
   *
   * @return object
   */
  HmNewsletter.prototype.setPermissionTexts = function () {
    var $thisObj = this;
    window.thsixtyQ.push(['permissions.get', {
      success: function (permissions) {
        // Clean up markup in permissions wrapper.
        $thisObj.$perms.html('');
        console.log(permissions);
        // Show permissions.
        jQuery.each(permissions, function (index, value) {
          // For now we only show the privacy checkbox.
          if (index == 'datenschutzeinwilligung' || index == 'privacy') {
            // For now we fake the machine name of the permission - should be delivered ba service call also.
            var machine_name = index;
            var version = value.version;
            var markup = '<label for="promo_permission_' + index + '"><div class="checkbox">';
            markup += '<input data-version="' + version + '" data-name="' + machine_name + '" type="checkbox" name="promo_permission" class="promo_permission" id="promo_permission_' + index + '">';
            markup += value.markup.text_label;
            if (value.markup.text_body) {
              markup += '<div id="' + index + 'permission_text_more" class="promo_permission_text--hidden">';
              markup += value.markup.text_body;
              markup += '</div>';
            }
            markup += '</div></label>';
            $thisObj.$perms.append(markup);
            // update uniform.
            $("#promo_permission_" + index).uniform();
          }
          // Form more-links.
          $thisObj.bindMoreLinks();
        });
      },
      error: function (err) {}
    }]);
  };

  /**
   * Bind the newsletter to Drupal.
   */
  Drupal.behaviors.hmNewsletter = {
    attach: function (context, settings) {
      var NL = new HmNewsletter(context);
      // Set permission texts.
      NL.setPermissionTexts();
      // Form submission.
      NL.bindSubmit();
    }
  };
})
(jQuery, Drupal, this, this.document);