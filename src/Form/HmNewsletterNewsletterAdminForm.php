<?php

/**
 * @file
 * Contains \Drupal\hm_newsletter\Form\HmNewsletterNewsletterAdminForm.
 */

namespace Drupal\hm_newsletter\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Element;

class HmNewsletterNewsletterAdminForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'hm_newsletter_newsletter_admin_form';
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $this->config('hm_newsletter.settings');

    foreach (Element::children($form['hm_newsletter']) as $variable) {
      $config->set($variable, $form_state->getValue($form['hm_newsletter'][$variable]['#parents']));
    }
    $config->save();

    if (method_exists($this, '_submitForm')) {
      $this->_submitForm($form, $form_state);
    }

    parent::submitForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['hm_newsletter.settings'];
  }

  public function buildForm(array $form, \Drupal\Core\Form\FormStateInterface $form_state) {
    $hm_newsletter_settings = $this->config('hm_newsletter.settings');
    $form = [];
    $form['hm_newsletter'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Harbourmaster newsletter configuration'),
    ];

    $form['hm_newsletter']['hm_environment'] = array(
      '#title' => 'Environment',
      '#type' => 'select',
      '#options' => array(
        'staging' => 'staging',
        'production' => 'production',
      ),
      '#default_value' => $hm_newsletter_settings->get('hm_environment'),
    );


    $form['hm_newsletter']['hm_client_id'] = array(
      '#title' => $this->t('Client id'),
      '#description' => $this->t('Client id will be used for agreements.'),
      '#type' => 'textfield',
      '#required' => TRUE,
      '#default_value' => $hm_newsletter_settings->get('hm_client_id'),
    );


    $form['hm_newsletter']['hm_available_newsletters'] = array(
      '#title' => $this->t('Available newsletters'),
      '#description' => $this->t('Enter one value per line, in the format key|label.
     The key consists of CLIENTID_NEWSLETTERID, and is used by the thsixty api. The label will be used in displayed values and edit forms.'),
      '#type' => 'textarea',
      '#default_value' => $hm_newsletter_settings->get('hm_available_newsletters'),
    );


    $form['hm_newsletter']['hm_imprint_text'] = array(
      '#title' => $this->t('Imprint text'),
      '#description' => $this->t('Text is displayed in the footer of the newsletter subscription form.'),
      '#type' => 'textarea',
      '#default_value' => $hm_newsletter_settings->get('hm_imprint_text'),
    );

    return parent::buildForm($form, $form_state);
  }

}