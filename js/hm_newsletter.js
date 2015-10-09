/**
 * Extend Number functions and add pad function to
 * allow leading zeros.
 */
Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
};

(function ($, Drupal, window, document) {
  /**
   * Harbourmaster Newsletter object.
   * @constructor
   */
  function HmNewsletter(context) {
    this.$wrapper = $('#hm-newsletter-subscribe', context);
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
  HmNewsletter.prototype.bindMoreLinks = function() {
    var $thisObj = this;
    // Open more text div.
    this.$form.find('.read-more').on('click', function(e){
      // Click should no affect label checkbox.
      e.preventDefault();
      if (!$(this).hasClass('visible')) {
        $(this).addClass('visible').text('Ausblenden');
        $($(this).data('toggle')).show();
      }
      else {
        $(this).removeClass('visible').text($(this).data('toggle-text'));
        $($(this).data('toggle')).hide();
      }
    });
  };

  /**
   * Submit function for newsletter
   */
  HmNewsletter.prototype.bindSubmit = function() {

    var $thisObj = this;

    this.$form.on('submit', $.proxy(function (pEvent) {

      // On submission we remove old alerts.
      $thisObj.removeAlerts();

      var valid = true;
      var data = {
        client: 0,
        groups: [],
        user: {}
      };


      // Get userdata from fields.
      $.each(HmNewsletter.fields, function(index) {
        var field = $thisObj.formField(index);
        // Get the value from the field, if it exists.
        if (field.length) {
          var val = field.val();
          data.user[index] = val;
          // When the field is required, the value must not be empty.
          if (val == '' && field.attr('required')) {
            $thisObj.addAlert('danger', index, 'Das Feld ist erforderlich.');
            valid = false;
          }
          // Check for valid email address.
          var regex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
          if ((index == 'email' && val.length > 0) && !regex.test(val)) {
            $thisObj.addAlert('danger', index, 'Bitte überprüfen Sie die Eingabe der E-Mail Adresse.');
            valid = false;
          }
        }
      });

      // Get groups from form.
      var groups = [];
      $thisObj.$form.find('[name="groups[]"]:checked').each(function() {
        groups.push($(this).val());
      });

      // Validate on selected newsletter.
      if (groups.length == 0) {
        $thisObj.addAlert('danger', 'groups[]', 'Bitte wählen Sie mindestens einen Newsletter aus.');
      }

      // Check if privacy agreement was checked.
      var $privacy_agreement = $thisObj.$form.find('[name="privacy_agreement"]');
      if ($privacy_agreement.length && $privacy_agreement.is(':checked') == false) {
        $thisObj.addAlert('danger', 'privacy_agreement', 'Bitte bestätigen Sie die AGB/ Datenschutzbestimmungen.');
      }

      // Get day of birth from form and reformat data.
      var dob_day = parseInt($thisObj.$form.find('[name="dob_day').val());
      var dob_month = parseInt($thisObj.$form.find('[name="dob_month').val());
      var dob_year = parseInt($thisObj.$form.find('[name="dob_year').val());
      if(dob_day > 0  && dob_month > 0 && dob_year > 0) {
       data.user.dateofbirth = dob_year  + '-' + (dob_month).pad() + '-' + (dob_day).pad();
      }

      // Get hidden groups - only if promo permission is checked.
      var $promo_permission = $thisObj.$form.find('[name="promo_permission"]');
      if ($promo_permission.is(':checked') == true) {
        $thisObj.$form.find('[name="groups[]"]').each(function () {
          if ($(this).attr('type') == 'hidden') {
            groups.push($(this).val());
          }
        });
      }

      // Build data for newsletter subscriptions - split up by clients/ groups.
      var client_groups = [];
      $.each(groups, function(index, value) {
        var group_data = value.split('_');
        if (group_data.length == 2) {
          if(client_groups[group_data[0]] == undefined) {
            client_groups[group_data[0]] = [];
          }
          client_groups[group_data[0]].push(group_data[1]);
        }
      });

      // If we did not quit, we send the request.
      if (valid && client_groups.length) {
        // Send request for every client and it's subscribed groups.
        client_groups.forEach(function (value, index, arr) {
          data.client = index;
          data.groups = value;
          $thisObj.sendSubscribeRequest(data);
        });
        $thisObj.scrollPage();
      }
      return false;
    }, this));
  };

  /**
   * Scroll up page to actual form.
   */
  HmNewsletter.prototype.scrollPage = function() {
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
  HmNewsletter.prototype.addAlert = function(type, field, message) {

    // Mark field as error.
    if (type == 'danger' && field !== undefined) {
      this.setValidationState(this.formField(field), 'has-error');
    }
    var alertString = '<div class="alert alert-'+ type + '" role="alert">' + message +'</div>';
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
  HmNewsletter.prototype.setValidationState = function(el, state) {
    el.parents('.form-group').addClass(state);
  };


  /**
   * Removes all alerts from the newsletter form allert section.
   */
  HmNewsletter.prototype.removeAlerts = function() {
    this.$alerts.html('');
    this.$form.find('.form-group').removeClass('has-error');
  };

  /**
   * Get the given form field.
   *
   * @param {string} field
   * @returns {*}
   */
  HmNewsletter.prototype.formField = function(field) {
    return this.$form.find('[name="' + field + '"]');
  };


  /**
   * Show success after subscribing to newsletter.
   */
  HmNewsletter.prototype.showSuccess = function() {
    var $thisObj = this;
    // Reset complete form.
    this.$form.trigger("reset");
    this.$form.hide();
    this.$success.show();
  };

  /**
   * Show error after failed subscribtion to newsletter.
   */
  HmNewsletter.prototype.showError = function() {
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
  HmNewsletter.prototype.sendSubscribeRequest = function(data) {
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
   * Bind the newsletter to Drupal.
   */
  Drupal.behaviors.hmNewsletter = {
    attach: function (context, settings) {
      var NL = new HmNewsletter(context);
      // Form submission.
      NL.bindSubmit();
      // Form more-links.
      NL.bindMoreLinks();
    }
  };
})
(jQuery, Drupal, this, this.document);