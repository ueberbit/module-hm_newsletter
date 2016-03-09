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

  $form['hm_newsletter']['hm_client_id'] = array(
    '#title' => t('Client id'),
    '#description' => t('Client id will be used for agreements.'),
    '#type' => 'textfield',
    '#required' => TRUE,
    '#default_value' => variable_get('hm_client_id', ''),
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
    '#description' => t('Show an extra checkbox to confirm data proteciton rules.'),
    '#type' => 'textfield',
    '#default_value' => variable_get('hm_link_privacy', ''),
  );

  $form['hm_newsletter']['hm_imprint_text'] = array(
    '#title' => t('Imprint text'),
    '#description' => t('Text is displayed in the footer of the newsletter subscription form.'),
    '#type' => 'textarea',
    '#default_value' => variable_get('hm_imprint_text', ''),
  );

  return system_settings_form($form);
}
