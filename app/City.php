<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    
     protected $table = 'city';

     //protected $fillable = ['cityname', 'state'];
	 protected $primaryKey = 'idcity';
	 
	 public $timestamps = false;   // for disabling eloquents' 'created_at' and 'updated_at' table columns
	 
	 protected $guarded = ['idcity'];
}

?>