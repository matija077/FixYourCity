<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class feedback extends Model
{
    
     protected $table = 'feedback';

     //protected $fillable = ['cityname', 'state'];
	 protected $primaryKey = 'idfeedback';
	 
	 public $timestamps = true;   // for disabling eloquents' 'created_at' and 'updated_at' table columns
	 
	 protected $guarded = ['idfeedback'];
}

?>