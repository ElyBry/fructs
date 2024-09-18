@extends('layouts.app')

@section('content')
    <div class="row">
        <div class="col-lg-12 margin-tb">
            <div class="pull-left">
                <h2>Продукты</h2>
            </div>
            <div class="pull-right">
                <a class="btn btn-success mb-2" href="{{ route('products.create') }}"><i class="fa fa-plus"></i> Создать новый продукт </a>
            </div>
        </div>
    </div>

    @session('success')
    <div class="alert alert-success" role="alert">
        {{ $value }}
    </div>
    @endsession

    <table class="table table-bordered">
        <tr>
            <th>№</th>
            <th>Название</th>
            <th>Описание</th>
            <th>Цена</th>
            <th>За:</th>
            <th>Страна</th>
            <th>Кол-во</th>
            <th width="280px">Действия</th>
        </tr>
        @foreach ($products as $key => $product)
            <tr>
                <td>{{ ++$i }}</td>
                <td>{{ $product->title }}</td>
                <td>{{ $product->description }}</td>
                <td>{{ $product->price }}</td>
                <td>{{ $product->weight }}</td>
                <td>{{ $product->count }}</td>
                <td>
                    @if(!empty($product->getCountry($product->country_id)))
                        @foreach($product->getCountry($product->country_id) as $v)
                            <label class="badge bg-success">{{ $v }}</label>
                        @endforeach
                    @endif
                </td>
                <td>
                    <a class="btn btn-info btn-sm" href="{{ route('users.show',$product->id) }}"><i class="fa-solid fa-list"></i> Показать</a>
                    <a class="btn btn-primary btn-sm" href="{{ route('users.edit',$product->id) }}"><i class="fa-solid fa-pen-to-square"></i> Изменить</a>
                    <form method="POST" action="{{ route('users.destroy', $product->id) }}" style="display:inline">
                        @csrf
                        @method('DELETE')

                        <button type="submit" class="btn btn-danger btn-sm"><i class="fa-solid fa-trash"></i> Удалить</button>
                    </form>
                </td>
            </tr>
        @endforeach
    </table>

    {!! $products->links('pagination::bootstrap-5') !!}

@endsection
