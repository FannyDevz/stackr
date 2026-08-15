<?php

return [
    // VAPID application-server keys used to authenticate push messages.
    // Generate with Minishlink\WebPush\VAPID::createVapidKeys().
    'vapid' => [
        'subject' => env('VAPID_SUBJECT', config('app.url')),
        'public_key' => env('VAPID_PUBLIC_KEY'),
        'private_key' => env('VAPID_PRIVATE_KEY'),
    ],
];
