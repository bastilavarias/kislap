<?php

namespace App\Filament\Widgets;

use App\Models\Project;
use App\Support\ProjectContentInspector;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class ProjectHealthTable extends TableWidget
{
    protected int|string|array $columnSpan = 'full';

    public function getTableQuery(): Builder
    {
        return Project::query()
            ->latest('updated_at')
            ->limit(10);
    }

    public function getTableColumns(): array
    {
        return [
            TextColumn::make('name')
                ->searchable()
                ->sortable(),
            TextColumn::make('type')
                ->badge(),
            BadgeColumn::make('content_status')
                ->label('Content')
                ->getStateUsing(function (Project $record): string {
                    return empty(ProjectContentInspector::issues($record)) ? 'Complete' : 'Needs content';
                })
                ->colors([
                    'success' => 'Complete',
                    'warning' => 'Needs content',
                ]),
            TextColumn::make('content_issues')
                ->label('Issues')
                ->getStateUsing(function (Project $record): string {
                    $issues = ProjectContentInspector::issues($record);

                    return $issues ? implode(', ', array_slice($issues, 0, 3)) : '—';
                })
                ->toggleable(),
            TextColumn::make('updated_at')
                ->dateTime()
                ->sortable(),
        ];
    }
}
