<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
          'create-users',
          'edit-users',
          'delete-users',
          'view-users',
          'create-roles',
          'edit-roles',
          'delete-roles',
          'view-roles',
          'edit-products',
          'create-products',
          'delete-products',
          'buy-products',
        ];
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // role
        $superAdminRole = Role::create(['name' => 'Super Admin']);
        $superAdminRole->givePermissionTo($permissions);
        $adminRole = Role::create(['name' => 'Admin']);
        $adminRole->givePermissionTo($permissions);

        $managerRole = Role::create(['name' => 'Manager']);
        $managerRole->givePermissionTo([
            'create-products',
            'edit-products',
            'delete-products',
        ]);

        $buyerRole = Role::create(['name' => 'User']);
        $buyerRole->givePermissionTo([
            'buy-products',
        ]);
    }
}
