<?php

namespace App\Filament\Resources\Linktrees\RelationManagers;

use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Resources\RelationManagers\RelationManager;

class LinktreeSectionsRelationManager extends RelationManager
{
    protected static string $relationship = 'sections';

    protected static ?string $recordTitleAttribute = 'title';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Section')
                    ->schema([
                        Select::make('type')
                            ->options([
                                'promo' => 'Promo',
                                'link' => 'Link',
                                'quote' => 'Quote',
                                'banner' => 'Banner',
                                'support' => 'Support',
                            ])
                            ->required(),
                        TextInput::make('title')
                            ->maxLength(255),
                        Textarea::make('description')
                            ->rows(3)
                            ->columnSpanFull(),
                        TextInput::make('url')
                            ->maxLength(255),
                        TextInput::make('app_url')
                            ->maxLength(255),
                        TextInput::make('image_url')
                            ->url()
                            ->maxLength(255),
                        TextInput::make('icon_key')
                            ->maxLength(255),
                        TextInput::make('accent_color')
                            ->maxLength(255),
                        Textarea::make('quote_text')
                            ->rows(2)
                            ->columnSpanFull(),
                        TextInput::make('quote_author')
                            ->maxLength(255),
                        Textarea::make('banner_text')
                            ->rows(2)
                            ->columnSpanFull(),
                        Textarea::make('support_note')
                            ->rows(2)
                            ->columnSpanFull(),
                        TextInput::make('support_qr_image_url')
                            ->url()
                            ->maxLength(255),
                        TextInput::make('cta_label')
                            ->maxLength(255),
                        TextInput::make('placement_order')
                            ->numeric()
                            ->default(0),
                    ])
                    ->columns(2),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('type')
                    ->badge()
                    ->sortable(),
                TextColumn::make('title')
                    ->searchable()
                    ->toggleable(),
                TextColumn::make('placement_order')
                    ->label('Order')
                    ->sortable()
                    ->toggleable(),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->headerActions([
                CreateAction::make(),
            ]);
    }
}
