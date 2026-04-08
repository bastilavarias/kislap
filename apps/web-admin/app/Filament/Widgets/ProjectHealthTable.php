<?php

namespace App\Filament\Widgets;

use App\Models\Project;
use App\Support\AdminDashboardService;
use App\Support\ProjectContentInspector;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class ProjectHealthTable extends TableWidget
{
    protected static ?string $heading = 'Projects that need attention';

    protected int|string|array $columnSpan = 'full';

    public function getTableQuery(): Builder
    {
        $ids = app(AdminDashboardService::class)->needsAttentionProjectIds(8);

        if ($ids === []) {
            return Project::query()->whereRaw('1 = 0');
        }

        $orderedIds = implode(',', $ids);

        return Project::query()
            ->with('user')
            ->whereKey($ids)
            ->orderByRaw("FIELD(id, {$orderedIds})");
    }

    public function getTableColumns(): array
    {
        return [
            TextColumn::make('name')
                ->searchable()
                ->sortable(),
            TextColumn::make('user.full_name')
                ->label('Owner')
                ->toggleable(),
            TextColumn::make('type')
                ->badge(),
            IconColumn::make('published')
                ->boolean()
                ->label('Live'),
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

                    return $issues ? implode(', ', array_slice($issues, 0, 3)) : '-';
                })
                ->wrap()
                ->toggleable(),
            TextColumn::make('sub_domain')
                ->label('Subdomain')
                ->placeholder('-')
                ->toggleable(),
            TextColumn::make('updated_at')
                ->since()
                ->sortable(),
        ];
    }
}
