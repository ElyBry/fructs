<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController as BaseController;
use App\Models\TypeProducts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Encoders\AutoEncoder;
use Intervention\Image\Laravel\Facades\Image;

class TypeProductsController extends BaseController
{
    public function index()
    {
        $query = TypeProducts::query();

        $types = $query->orderBy('created_at', 'desc')->paginate(10);

        return $types;
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'img' => 'required',
            'image' => 'required'
        ]);
        $input = $request->all();
        if ($request->hasFile('image')) {
            try {
                $image = Image::read($request->file('image'));
                $image->encode(new AutoEncoder('webp'));
                $path = 'image/types_for_products/';
                $uniq = $this->generateUniqueFilename($path);
                $in = $path . $uniq;
                $image->save($in);
                $input['img'] = $in;
            } catch (\Exception $e) {
                return $this->sendError($e->getMessage(), 500);
            }
        }
        $types = TypeProducts::create($input);
        return $this->sendResponse($types, "Успешно добавлено");
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
            'img' => 'required'
        ]);
        $input = $request->all();
        if ($request->hasFile('image')) {
            try {
                if (isset($input['img'])) {
                    $previousImagePath = public_path($input['img']);
                    if (file_exists($previousImagePath)) {
                        unlink($previousImagePath);
                    }
                }
                $image = Image::read($request->file('image'));
                $image->encode(new AutoEncoder('webp'));
                $path = 'image/types_for_products/';
                $uniq = $this->generateUniqueFilename($path);
                $in = $path . $uniq;
                $image->save($in);
                $input['img'] = $in;
            } catch (\Exception $e) {
                return $this->sendError($e->getMessage(), 500);
            }
        }
        $types = TypeProducts::find($id);
        $types->update($input);
        return $this->sendResponse($types, "Успешно обновлено");
    }
    public function destroy($id)
    {
        $types = TypeProducts::find($id);
        $imagePath = public_path($types['img']);
        if (file_exists($imagePath)) {
            unlink($imagePath);
        }
        $types->delete();
        return $this->sendResponse(null, 'Успешно удалено.');
    }
    public function getNewTypeProducts()
    {
        $type = TypeProducts::orderBy('created_at', 'desc')->first();
        return $type;
    }
    public function getAllTypeProducts()
    {
        $typesProducts = TypeProducts::all();
        return $typesProducts;
    }
}
