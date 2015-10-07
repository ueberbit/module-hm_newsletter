(function ($, Drupal, window, document) {

  /**
   * Harbourmaster Newsletter object.
   * @constructor
   */
  function HmNewsletter(context) {
    this.$wrapper = $('#hm-newsletter-subscribe', context);
    this.$form = this.$wrapper.find('form');
    this.$alerts = this.$wrapper.find('.hm_newsletter__alerts');
  }

  // Global list of possible fields.
  HmNewsletter.fields = {
    salutation: null,
    firstname: null,
    lastname: null,
    postalcode: null,
    city: null,
    birthday: null,
    email: null
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
        client: this.client,
        groups: [],
        agreements: [],
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
            return false;
          }
        }
      });

      // Get groups from form.
      $thisObj.$form.find('[name="groups[]"]:checked').each(function() {
        data.groups.push($(this).val());
      });
      // Validate on selected newsletter.
      if (data.groups.length == 0) {
        $thisObj.addAlert('danger', 'groups[]', 'Bitte wählen Sie mindestens einen Newsletter aus.');
        return false;
      }

      // Get selected aggreements from form.
      $thisObj.$form.find('[name="agreements[]"]').each(function() {
        // In the case the checbox is checked we add it to the agreements.
        if ($(this).is(':checked')) {
          // Agreements that do not have a agreement version, will
          // not be added to the request.
          if ($(this).attr('data-agreement-version') !== undefined) {
            var agr = {
              'name': $(this).val(),
              'version': $(this).attr('data-agreement-version')
            };
            data.agreements.push(agr);
          }
        }
        else if ($(this).attr('required')) {
          $thisObj.setValidationState($(this), 'has-error');
          $thisObj.addAlert('danger', null, 'Die Auswahl ist erforderlich.');
          valid = false;
          return false;
        }
      });

      // If we did not quit, we send the request.
      if (valid) {
        //this.sendSubscribeRequest(data);
        console.log(data);
      }

      return false;

    }, this));
  };

  /**
   * Open more-text links.
   */


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
    this.$alerts.append(alertString);
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