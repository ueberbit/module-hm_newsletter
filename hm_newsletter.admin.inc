<?php

/**
 * Custom configuration page for harbourmaster newsletter.
 */
function hm_newsletter_newsletter_admin_form($form, &$form_state) {
  $form = array();
  $form['hm_newsletter'] = array(
    '#type' => 'fieldset',
    '#title' => t('Harbourmaster newsletter configuration'),
  );

  $form['hm_newsletter']['hm_environment'] = array(
    '#title' => 'Environment',
    '#type' => 'select',
    '#options' => array(
      'staging' => 'staging',
      'production' => 'production',
    ),
    '#default_value' => variable_get('hm_environment', 'production'),
  );

  $form['hm_newsletter']['hm_available_newsletters'] = array(
    '#title' => t('Available newsletters'),
    '#description' => t('Enter one value per line, in the format key|label.
The key consists of CLIENTID_NEWSLETTERID, and is used by the thsixty api. The label will be used in displayed values and edit forms.'),
    '#type' => 'textarea',
    '#default_value' => variable_get('hm_available_newsletters', ''),
  );

  $form['hm_newsletter']['hm_link_privacy'] = array(
    '#title' => t('Link to privacy page'),
    '#type' => 'textfield',
    '#required' => TRUE,
    '#default_value' => variable_get('hm_link_privacy', ''),
  );

  $form['hm_newsletter']['hm_promo_permission'] = array(
    '#title' => t('Promotion permission text'),
    '#description' => t('Text for promotion permission'),
    '#type' => 'textarea',
    '#default_value' => variable_get('hm_promo_permission', ''),
  );

  $form['hm_newsletter']['hm_promo_permission_ids'] = array(
    '#title' => t('Promotion permission groups'),
    '#description' => t('Enter one value per line, in the format CLIENTID_GROUPID.'),
    '#type' => 'textarea',
    '#default_value' => variable_get('hm_promo_permission_ids', ''),
    '#states' => array(
      'visible' => array(
        ':input[name="hm_promo_permission"]' => array('filled' => TRUE),
      ),
      'required' => array(
        ':input[name="hm_promo_permission"]' => array('filled' => TRUE),
      ),
    ),
  );

  $form['hm_newsletter']['hm_promo_permission_more_text'] = array(
    '#title' => t('Promotion permission more text'),
    '#description' => t('More text for promotion permission'),
    '#type' => 'textarea',
    '#default_value' => variable_get('hm_promo_permission_more_text', ''),
    '#states' => array(
      'visible' => array(
        ':input[name="hm_promo_permission"]' => array('filled' => TRUE),
      ),
    ),
  );

  $form['hm_newsletter']['hm_promo_company_list'] = array(
    '#title' => t('Promotion company list'),
    '#type' => 'textarea',
    '#default_value' => variable_get('hm_promo_company_list', ''),
    '#states' => array(
      'visible' => array(
        ':input[name="hm_promo_permission"]' => array('filled' => TRUE),
      ),
    ),
  );

  $form['hm_newsletter']['hm_promo_data_categories'] = array(
    '#title' => t('Promotion data categories'),
    '#type' => 'textarea',
    '#default_value' => variable_get('hm_promo_data_categories', ''),
    '#states' => array(
      'visible' => array(
        ':input[name="hm_promo_permission"]' => array('filled' => TRUE),
      ),
    ),
  );

  $form['hm_newsletter']['hm_promo_revoke_text'] = array(
    '#title' => t('Promotion revoke text'),
    '#type' => 'textarea',
    '#default_value' => variable_get('hm_promo_revoke_text', ''),
    '#states' => array(
      'visible' => array(
        ':input[name="hm_promo_permission"]' => array('filled' => TRUE),
      ),
    ),
  );

  $form['hm_newsletter']['hm_imprint_text'] = array(
    '#title' => t('Imprint text'),
    '#description' => t('Text is displayed in the footer of the newsletter subscription form.'),
    '#type' => 'textarea',
    '#default_value' => variable_get('hm_imprint_text', ''),
  );


  return system_settings_form($form);
}
