<?php

namespace App\Filament\Resources\Portfolios\RelationManagers;

use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Resources\RelationManagers\RelationManager;

class ShowcasesRelationManager extends RelationManager
{
    protected static string $relationship = 'showcases';

    protected static ?string $recordTitleAttribute = 'name';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Showcase')
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('role')
                            ->maxLength(255),
                        TextInput::make('url')
                            ->url()
                            ->maxLength(255),
                        Textarea::make('description')
                            ->rows(4)
                            ->columnSpanFull(),
                        TextInput::make('placement_order')
                            ->numeric()
                            ->default(0),
                        Toggle::make('is_featured')
                            ->default(false),
                        Toggle::make('is_approved')
                            ->default(false),
                    ])
                    ->columns(2),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('role')
                    ->toggleable(),
                TextColumn::make('placement_order')
                    ->label('Order')
                    ->sortable()
                    ->toggleable(),
                TextColumn::make('is_approved')
                    ->badge()
                    ->label('Approved')
                    ->formatStateUsing(fn (bool $state): string => $state ? 'Yes' : 'No'),
                TextColumn::make('is_featured')
                    ->badge()
                    ->label('Featured')
                    ->formatStateUsing(fn (bool $state): string => $state ? 'Yes' : 'No'),
                TextColumn::make('url')
                    ->toggleable()
                    ->wrap(),
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
