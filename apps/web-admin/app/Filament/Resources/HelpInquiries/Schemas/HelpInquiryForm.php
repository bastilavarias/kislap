<?php

namespace App\Filament\Resources\HelpInquiries\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class HelpInquiryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Help Inquiry')
                    ->schema([
                        Placeholder::make('title')
                            ->content(fn ($record): string => (string) $record?->title)
                            ->columnSpan(2),
                        Placeholder::make('name')
                            ->content(fn ($record): string => (string) $record?->name),
                        Placeholder::make('email')
                            ->content(fn ($record): string => (string) $record?->email),
                        Placeholder::make('mobile_number')
                            ->label('Mobile number')
                            ->content(fn ($record): string => $record?->mobile_number ?: 'Not provided'),
                        Placeholder::make('source_page')
                            ->label('Source page')
                            ->content(fn ($record): string => $record?->source_page ?: 'Not captured'),
                        Placeholder::make('ip_address')
                            ->label('IP address')
                            ->content(fn ($record): string => (string) $record?->ip_address),
                        Placeholder::make('description')
                            ->content(fn ($record): string => (string) $record?->description)
                            ->columnSpanFull(),
                        Select::make('status')
                            ->options([
                                'new' => 'New',
                                'in_progress' => 'In progress',
                                'resolved' => 'Resolved',
                                'spam' => 'Spam',
                            ])
                            ->required(),
                        DateTimePicker::make('resolved_at')
                            ->label('Resolved at')
                            ->seconds(false),
                        Textarea::make('admin_notes')
                            ->label('Admin notes')
                            ->rows(5)
                            ->columnSpanFull(),
                    ])
                    ->columns(2)
                    ->columnSpanFull(),
            ])
            ->columns(1);
    }
}
