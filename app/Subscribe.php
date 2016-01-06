<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Subscribe extends Model
{
    
     protected $table = 'subscribe';

	 protected $primaryKey = ['iduser', 'idproblem'];
	 
	 public $timestamps = false;
	 
	 
}