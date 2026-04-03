<?php

namespace App\Filament\Resources\Menus\RelationManagers;

use App\Models\MenuCategory;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Resources\RelationManagers\RelationManager;

class MenuItemsRelationManager extends RelationManager
{
    protected static string $relationship = 'items';

    protected static ?string $recordTitleAttribute = 'name';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Item')
                    ->schema([
                        Select::make('menu_category_id')
                            ->label('Category')
                            ->options(fn () => MenuCategory::query()
                                ->where('menu_id', $this->ownerRecord->id)
                                ->orderBy('placement_order')
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->required(),
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('price')
                            ->required()
                            ->maxLength(80),
                        Textarea::make('description')
                            ->rows(3)
                            ->columnSpanFull(),
                        TextInput::make('image_url')
                            ->url()
                            ->maxLength(255),
                        TextInput::make('badge')
                            ->maxLength(80),
                        KeyValue::make('variants')
                            ->keyLabel('Variant')
                            ->valueLabel('Price')
                            ->columnSpanFull(),
                        TextInput::make('placement_order')
                            ->numeric()
                            ->default(0),
                        Toggle::make('is_available')
                            ->default(true),
                        Toggle::make('is_featured')
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
                TextColumn::make('category.name')
                    ->label('Category')
                    ->toggleable(),
                TextColumn::make('price')
                    ->toggleable(),
                IconColumn::make('is_available')
                    ->label('Available')
                    ->boolean(),
                IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean(),
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
