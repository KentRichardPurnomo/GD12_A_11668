<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Models\Komentar;
use App\Models\User;
use App\Models\Contents;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KomentarController extends Controller
{
    public function index()
    {
        $komentar = Komentar::with(['user', 'content'])->inRandomOrder()->get();

        return response([
            'message' => 'All Comments Retrieved',
            'data' => $komentar,
        ], 200);
    }
    public function showKomentarbyUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response([
                'message' => 'User Not Found',
                'data' => null,
            ], 404);
        }

        $komentar = Komentar::with('content')
            ->whereHas('content', function ($query) use ($user) {
                $query->where('id_user', $user->id);
            })
            ->get();

        return response([
            'message' => "Comments from User {$user->name} Retrieved",
            'data' => $komentar,
        ], 200);
    }
    public function showKomentarbyContent($contentId)
    {
        $komentar = Komentar::where('id_content', $contentId)->get();

        if ($komentar->isEmpty()) {
            return response([
                'message' => 'No comments found for this content',
                'data' => null,
            ], 404);
        }

        return response([
            'message' => 'Comments Retrieved Successfully',
            'data' => $komentar,
        ], 200);
    }
    public function store(Request $request)
    {
        $storeData = $request->all();

        $validate = Validator::make($storeData, [
            'comment' => 'required|max:255',
        ]);

        if ($validate->fails()) {
            return response(['message' => $validate->errors()], 400);
        }

        $idUser = Auth::user()->id;
        $user = User::find($idUser);
        if(is_null($user)){
            return response([
                'message' => 'User Not Found'
            ],404);
        }
        $idContent = $request->id_content;
        $content = Contents::find($idContent);
        if(is_null($content)){
            return response([
                'message' => 'Content Not Found'
            ],404);
        }
        $storeData['id_user'] = $user->id;
        $storeData['id_content'] = $content->id;
        $storeData['date_added'] = now();

        $komentar = Komentar::create($storeData);
        return response([
            'message' => 'Comment Added Successfully',
            'data' => $komentar,
        ], 201);
    }

    public function show(string $id)
    {
        $komentar = Komentar::find($id);

        if ($komentar) {
            return response([
                'message' => 'Comment Found',
                'data' => $komentar,
            ], 200);
        }

        return response([
            'message' => 'Comment Not Found',
            'data' => null,
        ], 404);
    }
    public function update(Request $request, string $id)
    {
        // Find the comment by its ID
        $komentar = Komentar::find($id);

        // Check if the comment exists
        if (!$komentar) {
            return response(['message' => 'Comment Not Found'], 404);
        }

        // Check if the current user is authorized to update this comment
        if ($komentar->id_user !== Auth::user()->id) {
            return response(['message' => 'You are not authorized to update this comment'], 403);
        }

        // Get the data from the request
        $data = $request->all();

        // Validate the incoming data
        $validate = Validator::make($data, [
            'comment' => 'required|max:255', // Validate comment content
        ]);

        if ($validate->fails()) {
            return response(['message' => $validate->errors()], 400);
        }
        
        // Update the comment with the validated and potentially updated data
        $komentar->update($data);

        // Load the relationships (user and content) after updating the comment
        return response([
            'message' => 'Comment Updated Successfully',
            'data' => $komentar->load(['user', 'content']), // Include user and content relationship
        ], 200);
    }

    public function destroy($id)
    {
        $komentar = Komentar::find($id);

        if (!$komentar) {
            return response(['message' => 'Comment Not Found'], 404);
        }

        if ($komentar->id_user !== Auth::user()->id) {
            return response(['message' => 'You are not authorized to delete this comment'], 403);
        }

        if ($komentar->delete()) {
            return response([
                'message' => 'Comment Deleted Successfully',
            ], 200);
        }

        return response(['message' => 'Failed to Delete Comment'], 500);
    }
}
