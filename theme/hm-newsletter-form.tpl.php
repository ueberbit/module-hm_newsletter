<div id="hm-newsletter-subscribe" class="hm_newsletter">
  <form class="form-horizontal" novalidate>
    <span class="hm_newsletter__headline">Newsletter abonnieren</span>

    <div class="hm_newsletter__newsletters form-group">
      <?php foreach ($newsletters as $nl_id => $nl_label): ?>
        <div class="checkbox">
          <label for="<?php print $nl_id; ?>">
            <span class="hm_newsletter__nl_logo nl_logo_<?php print $nl_id; ?>"></span>
            <input type="checkbox" name="groups[]" id="<?php print $nl_id; ?>" value="<?php print $nl_id; ?>"> <?php print $nl_label; ?>
          </label>
        </div>
      <?php endforeach; ?>
    </div>

    <span class="hm_newsletter__headline2">Persönliche Daten</span>

    <div class="hm_newsletter__salutation form-group">
      <label class="control-label required" for="salutation">Anrede</label>
      <select class="form-control" name="salutation" required="required">
        <option value="">- Ausw&auml;hlen -</option>
        <option>Frau</option>
        <option>Herr</option>
      </select>
    </div>
    <div class="hm_newsletter__wrap2col clearfix">
      <div class="hm_newsletter__firstname hm_newsletter__col form-group">
        <label class="control-label required" for="firstname">Vorname:</label>
        <input type="text" class="form-control" id="firstname" name="firstname"
               required="required">
      </div>
      <div class="hm_newsletter__lastname hm_newsletter__col form-group">
        <label class="control-label required" for="lastname">Nachname:</label>
        <input type="text" class="form-control" id="lastname" name="lastname"
               required="required">
      </div>
    </div>
    <div class="hm_newsletter__wrap2col clearfix">
      <div class="hm_newsletter__postcode hm_newsletter__col form-group">
        <label class="control-label" for="postalcode">Postleitzahl:</label>
        <input type="text" class="form-control" id="postalcode"
               name="postalcode">
      </div>
      <div class="hm_newsletter__city hm_newsletter__col form-group">
        <label class="control-label" for="city">Ort:</label>
        <input type="text" class="form-control" id="city" name="city">
      </div>
    </div>

    <div class="hm_newsletter__dob form-group">
      <label class="control-label" for="dob">Geburtsdatum</label>
      <select name="dob_day">
        <?php foreach ($birthday['day'] as $bd => $bd_label): ?>
          <option value="<?php print $bd ?>"><?php print $bd_label ?></option>
        <?php endforeach; ?>
      </select>
      <select name="dob_month">
        <?php foreach ($birthday['month'] as $bm => $bm_label): ?>
          <option value="<?php print $bm ?>"><?php print $bm_label ?></option>
        <?php endforeach; ?>
      </select>
      <select name="dob_year">
        <?php foreach ($birthday['year'] as $by => $by_label): ?>
          <option value="<?php print $by ?>"><?php print $by_label ?></option>
        <?php endforeach; ?>
      </select>
    </div>
    <div class="hm_newsletter__email form-group">
      <label class="control-label required" for="email">E-Mail</label>
      <input type="email" class="form-control" id="email" name="email"
             required="required">
    </div>
    <?php if (!empty($privacy_text)): ?>
      <div class="hm_newsletter__data_policy form-group">
        <label class="control-label" for="privacy_agreement">
          <input type="checkbox" class="form-control" id="privacy_agreement"
                 name="privacy_agreement" required="required">
          <?php print $privacy_text; ?>
        </label>
      </div>
    <?php endif; ?>
    <?php if (!empty($promo_permission)): ?>
      <span class="hm_newsletter__headline2">Datenschutzabfrage</span>
      <div class="hm_newsletter__promo_permission">
        <label for="promo_permission">
          <div class="checkbox">
            <input type="checkbox" name="promo_permission"
                   id="promo_permission"> <?php print $promo_permission; ?>
            <span class="read-more" data-toggle-text="Mehr"
                  data-toggle=".hm_newsletter__promo_permission_more">Mehr</span>
          </div>
        </label>
        <?php foreach ($promo_permission_ids as $promo_permission_id): ?>
          <input type="hidden" name="groups[]"
                 value="<?php print $promo_permission_id; ?>">
        <?php endforeach; ?>
        <div class="hm_newsletter__promo_permission_more">
          <?php if (!empty($promo_permission_more)): ?>
            <?php print $promo_permission_more; ?>
            <?php if (!empty($company_list)): ?>
              Die HBM-Unternehmen, für die die Einwilligung gilt, sind hier aufgelistet:
              <span class="read-more" data-toggle-text="Unternehmensliste"
                    data-toggle=".hm_newsletter__promo_company_list">Unternehmensliste</span>
              <div class="hm_newsletter__promo_company_list">
                <?php print $company_list; ?>
              </div>
            <?php endif; ?>
            <?php if (!empty($data_categories)): ?>
              <br/>Die Daten, auf die sich die Einwilligung bezieht, sind hier aufgelistet:
              <span class="read-more" data-toggle-text="Datenkategorien"
                    data-toggle=".hm_newsletter__promo_data_categories">Datenkategorien</span>
              <div class="hm_newsletter__promo_data_categories">
                <?php print $data_categories; ?>
              </div>
            <?php endif; ?>
            <?php if (!empty($revoke_text)): ?>
              <div class="hm_newsletter__promo_revoke">
                <?php print $revoke_text; ?>
              </div>
            <?php endif; ?>
          <?php endif; ?>
        </div>
      </div>
    <?php endif; ?>
    <div class="hm_newsletter__alerts"></div>
    <div class="hm_newsletter__submit">
      <button type="submit" class="btn btn-default">Jetzt anmelden</button>
    </div>
    <?php if (!empty($imprint_text)): ?>
      <div class="hm_newsletter__imprint">
        <?php print $imprint_text; ?>
      </div>
    <?php endif; ?>
  </form>
  <div class="hm_newsletter__success">
    Sie haben sich erfolgreich am Newsletter angemeldet.
  </div>
</div>