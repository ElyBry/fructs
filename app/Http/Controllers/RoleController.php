<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Validator;

class RoleController extends BaseController
{
    public function index()
    {
        $roles = Role::orderBy('id','DESC')->paginate(5);
        return $roles;
    }

    public function getPermissions()
    {
        $permission = Permission::all();
        return $permission;
    }

    public function store(Request $request)
    {
        $validator = validator::make($request->all(), [
            'name' => 'required|unique:roles,name',
            'permission' => 'required',
        ]);

        if($validator->fails()){
            return $this->sendError('Ошибка валидации', $validator->errors());
        }
        $permissionsID = array_map(
            function($value) { return (int)$value; },
            $request->input('permission')
        );

        $role = Role::create(['name' => $request->input('name')]);
        $role->syncPermissions($permissionsID);

        return $this->sendResponse($role, 'Успешно создана');
    }

    public function show($id)
    {
        $role = Role::find($id);
        $rolePermissions = Permission::join("role_has_permissions","role_has_permissions.permission_id","=","permissions.id")
            ->where("role_has_permissions.role_id",$id)
            ->get();

        return [$role,$rolePermissions];
    }

    public function edit($id)
    {
        $role = Role::find($id);
        $permission = Permission::get();
        $rolePermissions = DB::table("role_has_permissions")->where("role_has_permissions.role_id",$id)
            ->pluck('role_has_permissions.permission_id','role_has_permissions.permission_id')
            ->all();

        return [$role,$permission,$rolePermissions];
    }


    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'permission' => 'required',
        ]);
        if($validator->fails()){
            return $this->sendError('Ошибка валидации', $validator->errors());
        }
        $role = Role::find($id);
        $role->name = $request->input('name');
        $role->save();

        $permissionsID = array_map(
            function($value) { return (int)$value; },
            $request->input('permission')
        );

        $role->syncPermissions($permissionsID);

        return $this->sendResponse($role, 'Успшено обновлена');
    }

    public function destroy($id)
    {
        DB::table("roles")->where('id',$id)->delete();
        return $this->sendResponse(null, 'Роль успешно удалена');
    }
}
