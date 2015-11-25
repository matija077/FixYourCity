// database/seeds/DatabaseSeeder.php

<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\User;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        Model::unguard();

        $users = array(
                ['username' => 'Ryan Chenkie', 'email' => 'ryanchenkie@gmail.com', 'passwordhash' => Hash::make('secret'), 
				'accesslevel' => '1', 'karma' => '50']
        );
            
        // Loop through each user above and create the record for them in the database
        foreach ($users as $user)
        {
            User::create($user);
        }

        Model::reguard();
    }
}