<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class suggestCR extends Model
{
    
     protected $table = 'suggestcr';

     //protected $fillable = ['cityname', 'state'];
	 protected $primaryKey = 'idsuggestcr';
	 
	 public $timestamps = false;   // for disabling eloquents' 'created_at' and 'updated_at' table columns
	 
	 protected $guarded = ['idsuggestcr'];
}

?>