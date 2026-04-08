<?php

namespace App\Filament\Resources\Projects\Schemas;

use App\Models\User;
use App\Support\HostedSiteUrl;
use App\Support\FormUrlPreviewAction;
use Filament\Actions\Action;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ProjectForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Project')
                    ->schema([
                        Select::make('user_id')
                            ->label('Owner')
                            ->relationship('user', 'email')
                            ->getOptionLabelFromRecordUsing(fn (User $record): string => "{$record->full_name} ({$record->email})")
                            ->searchable()
                            ->preload()
                            ->required(),
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),
                        TextInput::make('sub_domain')
                            ->maxLength(255),
                        Placeholder::make('hosted_site_url')
                            ->label('Hosted site')
                            ->content(fn ($record, $get): string => HostedSiteUrl::fromSubdomain($get('sub_domain') ?: $record?->sub_domain) ?? 'Add a subdomain to generate the hosted URL.')
                            ->hintAction(
                                Action::make('visitSite')
                                    ->label('Visit site')
                                    ->icon('heroicon-o-arrow-top-right-on-square')
                                    ->url(
                                        fn ($record, $get): ?string => HostedSiteUrl::fromSubdomain($get('sub_domain') ?: $record?->sub_domain),
                                        shouldOpenInNewTab: true,
                                    )
                                    ->visible(fn ($record, $get): bool => filled(HostedSiteUrl::fromSubdomain($get('sub_domain') ?: $record?->sub_domain)))
                            )
                            ->columnSpanFull(),
                        Select::make('type')
                            ->options([
                                'portfolio' => 'Portfolio',
                                'linktree' => 'Linktree',
                                'menu' => 'Menu',
                                'biz' => 'Biz',
                                'waitlist' => 'Waitlist',
                            ])
                            ->required(),
                        Toggle::make('published')
                            ->default(false),
                        TextInput::make('og_image_url')
                            ->url()
                            ->maxLength(255)
                            ->suffixAction(FormUrlPreviewAction::make('previewOgImage'))
                            ->columnSpanFull(),
                        Textarea::make('description')
                            ->rows(4)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }
}
