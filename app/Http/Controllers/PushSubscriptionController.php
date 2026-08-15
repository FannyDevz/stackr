<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PushSubscriptionController extends Controller
{
    /** The VAPID public key the browser needs to create a subscription. */
    public function key()
    {
        return response()->json([
            'key' => config('webpush.vapid.public_key'),
        ]);
    }

    /** Register (or refresh) a browser push subscription for the current user. */
    public function store(Request $request)
    {
        $data = $request->validate([
            'endpoint' => ['required', 'string'],
            'keys.p256dh' => ['required', 'string'],
            'keys.auth' => ['required', 'string'],
            'contentEncoding' => ['nullable', 'string'],
        ]);

        $sub = $request->user()->pushSubscriptions()->updateOrCreate(
            ['endpoint' => $data['endpoint']],
            [
                'public_key' => $data['keys']['p256dh'],
                'auth_token' => $data['keys']['auth'],
                'content_encoding' => $data['contentEncoding'] ?? 'aes128gcm',
            ]
        );

        return response()->json(['id' => $sub->id], 201);
    }

    /** Remove a subscription (called on unsubscribe / permission revoke). */
    public function destroy(Request $request)
    {
        $data = $request->validate([
            'endpoint' => ['required', 'string'],
        ]);

        $request->user()->pushSubscriptions()->where('endpoint', $data['endpoint'])->delete();

        return response()->noContent();
    }
}
