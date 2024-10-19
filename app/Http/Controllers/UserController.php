<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Spatie\Permission\Models\Role;

class UserController extends BaseController {
    public function index(Request $request)
    {
        $user = User::query()
            ->leftJoin('model_has_roles', 'model_has_roles.model_id', '=', 'users.id')
            ->leftJoin('roles', 'roles.id', '=', 'model_has_roles.role_id')
            ->selectRaw('users.*, roles.id as role_id')
            ->paginate(12);

        return $user;
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|same:confirm-password',
            'roles' => 'required'
        ]);

        $input = $request->all();
        $input['password'] = Hash::make($input['password']);

        $user = User::create($input);
        $user->assignRole($request->input('roles'));

        return $this->sendResponse($user,'Пользователь успешно создан');
    }
    public function show($id)
    {
        $user = User::find($id);
        return $user;
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'email|unique:users,email,'.$id,
            'password' => 'same:confirm-password',
            'role_id' => 'required'
        ]);

        $input = $request->all();
        if(!empty($input['password'])){
            $input['password'] = Hash::make($input['password']);
        }else{
            $input = Arr::except($input,array('password'));
        }

        $user = User::find($id);
        $user->update($input);
        DB::table('model_has_roles')->where('model_id',$id)->update(['role_id' => $input['role_id']]);

        return $this->sendResponse($user,'Данные пользователя успешно обновлены');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return $this->sendResponse(null, 'Пользователь успешно удалён');
    }
}

