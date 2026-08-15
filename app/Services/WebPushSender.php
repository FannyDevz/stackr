<?php

namespace App\Services;

use App\Models\User;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

class WebPushSender
{
    /** Whether VAPID keys are present so pushes can actually be sent. */
    public function isConfigured(): bool
    {
        return filled(config('webpush.vapid.public_key')) && filled(config('webpush.vapid.private_key'));
    }

    /**
     * Push a JSON payload to every subscription the user has registered.
     * Expired/gone endpoints (404/410) are pruned. Returns count delivered.
     *
     * @param  array<string, mixed>  $payload
     */
    public function sendToUser(User $user, array $payload): int
    {
        if (! $this->isConfigured()) {
            return 0;
        }

        $subs = $user->pushSubscriptions()->get();
        if ($subs->isEmpty()) {
            return 0;
        }

        $webPush = new WebPush([
            'VAPID' => [
                'subject' => config('webpush.vapid.subject'),
                'publicKey' => config('webpush.vapid.public_key'),
                'privateKey' => config('webpush.vapid.private_key'),
            ],
        ]);

        $byEndpoint = [];
        foreach ($subs as $sub) {
            $byEndpoint[$sub->endpoint] = $sub;
            $webPush->queueNotification(
                Subscription::create([
                    'endpoint' => $sub->endpoint,
                    'publicKey' => $sub->public_key,
                    'authToken' => $sub->auth_token,
                    'contentEncoding' => $sub->content_encoding ?: 'aes128gcm',
                ]),
                json_encode($payload)
            );
        }

        $sent = 0;
        foreach ($webPush->flush() as $report) {
            $endpoint = $report->getEndpoint();
            if ($report->isSuccess()) {
                $sent++;
            } elseif ($report->isSubscriptionExpired() && isset($byEndpoint[$endpoint])) {
                $byEndpoint[$endpoint]->delete();
            }
        }

        return $sent;
    }
}
