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
        Permission::create(['name' => 'create-users']);
        Permission::create(['name' => 'edit-users']);
        Permission::create(['name' => 'delete-users']);
        Permission::create(['name' => 'create-products']);
        Permission::create(['name' => 'edit-products']);
        Permission::create(['name' => 'delete-products']);
        Permission::create(['name' => 'buy-products']);

        // role
        $adminRole = Role::create(['name' => 'Admin']);

        $adminRole->givePermissionTo([
            'create-users',
            'delete-users',
            'create-posts',
            'edit-posts',
            'delete-posts',
        ]);

        $managerRole = Role::create(['name' => 'Manager']);
        $managerRole->givePermissionTo([
            'create-products',
            'edit-products',
            'delete-products',
        ]);

        $buyerRole = Role::create(['name' => 'Buyer']);
        $buyerRole->givePermissionTo([
            'buy-products',
        ]);
    }
}
