<?php

namespace App\Support;

use App\Models\AdminAuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AdminAuditLogger
{
    /**
     * @param array<string, mixed> $context
     */
    public static function log(string $action, ?Model $target = null, ?int $targetUserId = null, array $context = []): void
    {
        $userId = Auth::id();

        if (! $userId) {
            return;
        }

        AdminAuditLog::create([
            'user_id' => $userId,
            'target_user_id' => $targetUserId,
            'target_type' => $target ? $target::class : null,
            'target_id' => $target?->getKey(),
            'action' => $action,
            'context' => $context,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }
}
