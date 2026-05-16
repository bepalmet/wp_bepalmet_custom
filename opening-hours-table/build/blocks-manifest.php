<?php
// This file is generated. Do not modify it manually.
return array(
	'opening-hours-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'bepalmet-custom/opening-hours-block',
		'category' => 'widgets',
		'description' => 'bepalmet-custom block to render the opening hours table',
		'title' => 'Opening hours',
		'version' => '1.0.0',
		'supports' => array(
			'html' => false,
			'anchor' => true,
			'custom-fields' => false
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'attributes' => array(
			'content' => array(
				'type' => 'string',
				'default' => 'Loading...'
			)
		),
		'textdomain' => 'bepalmet_block',
		'editorScript' => 'file:./index.js',
		'style' => 'file:./styles.scss',
		'render' => 'file:./render.php'
	),
	'text-with-format' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'bepalmet-custom/text-with-format',
		'category' => 'text',
		'description' => 'Sub-component to render and edit Rich Text for Opening Hours Settings',
		'title' => 'Text With Format',
		'version' => '1.0.0',
		'supports' => array(
			'html' => true,
			'anchor' => true,
			'custom-fields' => true
		),
		'attributes' => array(
			'content' => array(
				'type' => 'string',
				'source' => 'html'
			)
		),
		'textdomain' => 'text-with-format',
		'editorScript' => 'file:./index.js',
		'style' => 'file:./styles.scss'
	)
);
