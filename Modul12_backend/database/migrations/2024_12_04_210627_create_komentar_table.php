<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('komentar', function (Blueprint $table) {
            $table->id();
            $table->integer('id_user');
            $table->integer('id_content');
            $table->string('comment', 255);
            $table->dateTime('date_added')->useCurrent();
            $table->timestamps();

            $table->foreign('id_user')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('id_content')->references('id')->on('contents')->onDelete('cascade');
        });
    }
    
    public function down(): void
    {
        Schema::dropIfExists('komentar');
    }
};


