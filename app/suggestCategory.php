<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class suggestCategory extends Model
{
    
     protected $table = 'suggestcategory';

     //protected $fillable = ['cityname', 'state'];
	 protected $primaryKey = 'suggestcategory';
	 
	 public $timestamps = true;   // for disabling eloquents' 'created_at' and 'updated_at' table columns
	 
	 protected $guarded = ['suggestcategory'];
}

?>