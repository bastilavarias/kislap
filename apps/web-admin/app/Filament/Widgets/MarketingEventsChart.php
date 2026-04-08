<?php

namespace App\Filament\Widgets;

use App\Support\MarketingDashboardClient;
class MarketingEventsChart extends BaseChartWidget
{
    protected static ?int $sort = 100;

    protected ?string $heading = 'Marketing event mix';

    protected int|string|array $columnSpan = 1;

    protected ?string $maxHeight = '280px';

    protected function getData(): array
    {
        $overview = app(MarketingDashboardClient::class)->overview();
        $events = $overview['event_breakdown'] ?? [];

        return [
            'labels' => array_map(fn ($item) => (string) ($item['label'] ?? 'Unknown'), $events),
            'datasets' => [
                [
                    'label' => 'Events',
                    'data' => array_map(fn ($item) => (int) ($item['total'] ?? 0), $events),
                    'backgroundColor' => [
                        '#ef4444',
                        '#f59e0b',
                        '#2563eb',
                        '#22c55e',
                        '#111827',
                        '#a855f7',
                    ],
                ],
            ],
        ];
    }

    protected function getType(): string
    {
        return 'polarArea';
    }
}
