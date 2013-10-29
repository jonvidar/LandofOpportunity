<?php 
/**
 * @file
 * Page callbacks for admin section.
 */
/**
* email setting
*/
function landofopp_mail_settings() {
  $form['notification'] = array(
    '#type' => 'fieldset',
    '#title' => t('Notification'),
    '#weight' => 1,
    '#collapsible' => FALSE,
    '#collapsed' => FALSE,
  );
  $form['notification']['loo_mail_subject'] = array(
    '#type' => 'textfield',
    '#title' => t('Notification Subject'),
    '#default_value' => variable_get('loo_mail_subject', ''),
  );
  $form['notification']['loo_mail_body'] = array(
    '#type' => 'textarea',
    '#title' => t('Notification Body'),
    '#default_value' => variable_get('loo_mail_body', ''),
  );

  return system_settings_form($form);
}