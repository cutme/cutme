<?php

if(empty($_POST['email'])) {
	die('Error: Missing variables');
}

$name		= $_POST['email'];
$message	= $_POST['message'];

$to = 'info@cutme.pl';
$subject = 'Post ze strony';

$headers = 'From: '.$email."\r\n" .
	'Reply-To: '.$email."\r\n" .
	'X-Mailer: PHP/' . phpversion();
$subject = $subject;
$body.='Wiadomość: '.$message."\n";

if(mail($to, $subject, $body, $headers)) {
	die('Mail sent');
} else {
	die('Error: Mail failed');
}

?>
