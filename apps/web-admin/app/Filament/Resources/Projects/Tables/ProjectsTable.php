<?php

namespace App\Filament\Resources\Projects\Tables;

use App\Support\AdminAuditLogger;
use App\Support\ProjectContentInspector;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class ProjectsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('user.full_name')
                    ->label('Owner')
                    ->searchable(['users.first_name', 'users.last_name', 'users.email'])
                    ->toggleable(),
                TextColumn::make('type')
                    ->badge()
                    ->sortable(),
                BadgeColumn::make('content_status')
                    ->label('Content')
                    ->getStateUsing(fn ($record): string => empty(ProjectContentInspector::issues($record)) ? 'Complete' : 'Needs content')
                    ->colors([
                        'success' => 'Complete',
                        'warning' => 'Needs content',
                    ]),
                TextColumn::make('content_issues')
                    ->label('Issues')
                    ->getStateUsing(function ($record): string {
                        $issues = ProjectContentInspector::issues($record);

                        return $issues ? implode(', ', array_slice($issues, 0, 3)) : '—';
                    })
                    ->wrap()
                    ->toggleable(),
                TextColumn::make('slug')
                    ->searchable()
                    ->copyable(),
                TextColumn::make('sub_domain')
                    ->searchable()
                    ->copyable()
                    ->toggleable(),
                IconColumn::make('published')
                    ->boolean()
                    ->sortable(),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('type')
                    ->options([
                        'portfolio' => 'Portfolio',
                        'linktree' => 'Linktree',
                        'menu' => 'Menu',
                        'biz' => 'Biz',
                        'waitlist' => 'Waitlist',
                    ]),
                TernaryFilter::make('published'),
                TrashedFilter::make(),
            ])
            ->recordActions([
                Action::make('publish')
                    ->label('Publish')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn ($record): bool => ! $record->published)
                    ->action(function ($record): void {
                        $record->update(['published' => true]);
                        AdminAuditLogger::log('project.publish', $record);
                    })
                    ->disabled(fn (): bool => auth()->user()?->role === 'support'),
                Action::make('unpublish')
                    ->label('Unpublish')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->visible(fn ($record): bool => $record->published)
                    ->action(function ($record): void {
                        $record->update(['published' => false]);
                        AdminAuditLogger::log('project.unpublish', $record);
                    })
                    ->disabled(fn (): bool => auth()->user()?->role === 'support'),
                EditAction::make()
                    ->visible(fn (): bool => auth()->user()?->role !== 'support'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    BulkAction::make('publish')
                        ->label('Publish')
                        ->icon('heroicon-o-check-circle')
                        ->action(function ($records): void {
                            $records->each(function ($record): void {
                                $record->update(['published' => true]);
                                AdminAuditLogger::log('project.publish', $record);
                            });
                        })
                        ->requiresConfirmation(),
                    BulkAction::make('unpublish')
                        ->label('Unpublish')
                        ->icon('heroicon-o-x-circle')
                        ->action(function ($records): void {
                            $records->each(function ($record): void {
                                $record->update(['published' => false]);
                                AdminAuditLogger::log('project.unpublish', $record);
                            });
                        })
                        ->requiresConfirmation(),
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ])->visible(fn (): bool => auth()->user()?->role !== 'support'),
            ]);
    }
}
