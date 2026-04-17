<?php

namespace App\Filament\Resources\Users\Tables;

use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Filters\TrashedFilter;
use Illuminate\Support\Facades\Auth;
use Filament\Tables\Table;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('full_name')
                    ->label('Name')
                    ->searchable(['first_name', 'last_name'])
                    ->sortable(['first_name', 'last_name']),
                TextColumn::make('email')
                    ->searchable()
                    ->copyable(),
                TextColumn::make('role')
                    ->badge()
                    ->sortable(),
                TextColumn::make('mobile_number')
                    ->searchable()
                    ->toggleable(),
                IconColumn::make('email_verified_at')
                    ->label('Verified')
                    ->boolean()
                    ->getStateUsing(fn ($record): bool => filled($record->email_verified_at)),
                IconColumn::make('newsletter')
                    ->boolean()
                    ->label('Newsletter'),
                IconColumn::make('is_banned')
                    ->boolean()
                    ->label('Banned'),
                TextColumn::make('banned_at')
                    ->label('Banned At')
                    ->dateTime()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('projects_count')
                    ->counts('projects')
                    ->label('Projects')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
            ])
            ->filters([
                SelectFilter::make('role')
                    ->options([
                        'default' => 'Default',
                        'admin' => 'Admin',
                        'super_admin' => 'Super Admin',
                        'support' => 'Support',
                    ]),
                TernaryFilter::make('newsletter'),
                TernaryFilter::make('is_banned')
                    ->label('Banned'),
                TrashedFilter::make(),
            ])
            ->recordActions([
                Action::make('ban')
                    ->label('Ban')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->form([
                        Textarea::make('ban_reason')
                            ->label('Reason')
                            ->rows(3)
                            ->required(),
                    ])
                    ->action(function ($record, array $data): void {
                        $record->update([
                            'is_banned' => true,
                            'banned_at' => now(),
                            'ban_reason' => $data['ban_reason'],
                            'banned_by' => auth()->id(),
                        ]);
                    })
                    ->visible(fn ($record): bool => ! $record->is_banned && auth()->user()?->role !== 'support')
                    ->disabled(fn ($record): bool => in_array($record->role, ['admin', 'super_admin'], true)),
                Action::make('unban')
                    ->label('Unban')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(function ($record): void {
                        $record->update([
                            'is_banned' => false,
                            'banned_at' => null,
                            'ban_reason' => null,
                            'banned_by' => null,
                        ]);
                    })
                    ->visible(fn ($record): bool => $record->is_banned && auth()->user()?->role !== 'support'),
                Action::make('verify_email')
                    ->label('Verify Email')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(function ($record): void {
                        $record->update(['email_verified_at' => now()]);
                    })
                    ->visible(fn ($record): bool => empty($record->email_verified_at) && auth()->user()?->role !== 'support'),
                Action::make('reset_password')
                    ->label('Reset Password')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->form([
                        TextInput::make('password')
                            ->password()
                            ->revealable()
                            ->required()
                            ->minLength(8)
                            ->confirmed(),
                        TextInput::make('password_confirmation')
                            ->password()
                            ->revealable()
                            ->required()
                            ->minLength(8),
                    ])
                    ->action(function ($record, array $data): void {
                        $record->update(['password' => $data['password']]);
                        Notification::make()
                            ->title('Password updated')
                            ->success()
                            ->send();
                    })
                    ->visible(fn (): bool => auth()->user()?->role !== 'support'),
                Action::make('impersonate')
                    ->label('Impersonate')
                    ->color('gray')
                    ->requiresConfirmation()
                    ->action(function ($record): void {
                        session(['impersonator_id' => Auth::id()]);
                        Auth::login($record);
                    })
                    ->visible(fn ($record): bool => auth()->user()?->role !== 'support' && auth()->id() !== $record->id),
                Action::make('stop_impersonation')
                    ->label('Stop Impersonation')
                    ->color('gray')
                    ->requiresConfirmation()
                    ->action(function (): void {
                        $impersonatorId = session('impersonator_id');
                        if ($impersonatorId) {
                            Auth::loginUsingId($impersonatorId);
                            session()->forget('impersonator_id');
                        }
                    })
                    ->visible(fn (): bool => auth()->user()?->role !== 'support' && session()->has('impersonator_id')),
                EditAction::make()
                    ->visible(fn (): bool => auth()->user()?->role !== 'support'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    BulkAction::make('ban')
                        ->label('Ban')
                        ->icon('heroicon-o-no-symbol')
                        ->requiresConfirmation()
                        ->form([
                            Textarea::make('ban_reason')
                                ->label('Reason')
                                ->rows(3)
                                ->required(),
                        ])
                        ->action(function ($records, array $data): void {
                            $records->each(function ($record) use ($data): void {
                                $record->update([
                                    'is_banned' => true,
                                    'banned_at' => now(),
                                    'ban_reason' => $data['ban_reason'],
                                    'banned_by' => auth()->id(),
                                ]);
                            });
                        }),
                    BulkAction::make('unban')
                        ->label('Unban')
                        ->icon('heroicon-o-check-circle')
                        ->requiresConfirmation()
                        ->action(function ($records): void {
                            $records->each(function ($record): void {
                                $record->update([
                                    'is_banned' => false,
                                    'banned_at' => null,
                                    'ban_reason' => null,
                                    'banned_by' => null,
                                ]);
                            });
                        }),
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ])->visible(fn (): bool => auth()->user()?->role !== 'support'),
            ]);
    }
}
