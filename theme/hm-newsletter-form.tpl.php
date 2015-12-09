<div id="hm-newsletter-subscribe" class="hm_newsletter">
  <form class="form-horizontal" novalidate>
    <input type="hidden" name="client_id" value="<?php print $client_id; ?>">
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
      <label class="control-label required" for="email">E-Mail:</label>
      <input type="email" class="form-control" id="email" name="email"
             required="required">
    </div>
    <span class="hm_newsletter__required_info">* Pflichtfeld</span>
    <span class="hm_newsletter__headline2">Datenschutzabfrage</span>
    <div class="hm_newsletter__permissions form-group"></div>
    <?php if (!empty($revoke_text)): ?>
      <div class="hm_newsletter__promo_revoke">
        <?php print $revoke_text; ?>
      </div>
    <?php endif; ?>
    <div class="hm_newsletter__alerts"></div>
    <div class="hm_newsletter__submit">
      <button type="submit" class="btn btn-default">Jetzt anmelden</button>
    </div>
    <?php if (!empty($imprint_text)): ?>
      <span class="hm_newsletter__headline2">Impressum</span>
      <div class="hm_newsletter__imprint">
        <?php print $imprint_text; ?>
      </div>
    <?php endif; ?>
  </form>
  <div class="hm_newsletter__success">
    Vielen Dank f&uuml;r Ihre Anmeldung.
  </div>
  <div class="hm_newsletter__error alert alert-danger">
    Bei der Anmeldung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.<br>
    <a href="?">Newsletteranmeldung durchführen</a>
  </div>
</div>