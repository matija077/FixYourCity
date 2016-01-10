<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class suggestCity extends Model
{
    
     protected $table = 'suggestcity';

     //protected $fillable = ['cityname', 'state'];
	 protected $primaryKey = 'idsuggestcity';
	 
	 public $timestamps = true;   // for disabling eloquents' 'created_at' and 'updated_at' table columns
	 
	 protected $guarded = ['idsuggestcity'];
}

?>