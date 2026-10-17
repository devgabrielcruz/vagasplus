<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    // Importação de vagas por IA (reserva quando a página não traz dados estruturados).
    // Chave gratuita em https://aistudio.google.com — sem chave, o importador usa só os dados estruturados.
    'gemini' => [
        'key' => env('GEMINI_API_KEY'),
        'model' => env('GEMINI_MODEL', 'gemini-3.5-flash-lite'),
    ],

    // Publicidade (AdSense etc.). Desligada por padrão: os espaços só são renderizados quando ADS_ENABLED=true.
    'ads' => [
        'enabled' => (bool) env('ADS_ENABLED', false),
        'client' => env('ADS_CLIENT_ID'),
        // Mostra o aviso que pede para desativar o bloqueador de anúncios (só atua com a publicidade ligada).
        'adblock_wall' => (bool) env('ADS_ADBLOCK_WALL', true),
        // Banners FICTÍCIOS de demonstração nos espaços sem AdSense. Padrão: só em ambiente local.
        'demo' => (bool) env('ADS_DEMO', env('APP_ENV') === 'local'),
        // IDs de unidade do AdSense por posição (ADS_SLOT_HOME_TOP=1234567890 ...). Sem ID, o espaço mostra "Anuncie aqui".
        'slots' => [
            'home-top' => env('ADS_SLOT_HOME_TOP'),
            'home-mid' => env('ADS_SLOT_HOME_MID'),
            'list-top' => env('ADS_SLOT_LIST_TOP'),
            'list-card' => env('ADS_SLOT_LIST_CARD'),
            'list-card-2' => env('ADS_SLOT_LIST_CARD_2'),
            'job-top' => env('ADS_SLOT_JOB_TOP'),
            'job-mid' => env('ADS_SLOT_JOB_MID'),
            'job-side' => env('ADS_SLOT_JOB_SIDE'),
            'job-bottom' => env('ADS_SLOT_JOB_BOTTOM'),
            'categories-top' => env('ADS_SLOT_CATEGORIES_TOP'),
        ],
    ],

];
