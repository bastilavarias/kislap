<?php

namespace App\Filament\Resources\Linktrees\RelationManagers;

use App\Support\FormUrlPreviewAction;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Resources\RelationManagers\RelationManager;

class LinktreeLinksRelationManager extends RelationManager
{
    protected static string $relationship = 'links';

    protected static ?string $recordTitleAttribute = 'title';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                TextInput::make('title')
                    ->maxLength(255),
                TextInput::make('url')
                    ->url()
                    ->maxLength(255)
                    ->suffixAction(FormUrlPreviewAction::make('previewLinkUrl')),
                TextInput::make('image_url')
                    ->url()
                    ->maxLength(255)
                    ->suffixAction(FormUrlPreviewAction::make('previewLinkImage')),
                Textarea::make('description')
                    ->rows(3)
                    ->columnSpanFull(),
                TextInput::make('placement_order')
                    ->numeric()
                    ->default(0),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('url')
                    ->toggleable()
                    ->wrap(),
                TextColumn::make('placement_order')
                    ->label('Order')
                    ->sortable()
                    ->toggleable(),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make()
                    ->modalWidth('4xl'),
                DeleteAction::make(),
            ])
            ->headerActions([
                CreateAction::make()
                    ->modalWidth('4xl'),
            ]);
    }
}
