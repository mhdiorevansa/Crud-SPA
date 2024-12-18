<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth as FacadesAuth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Yajra\DataTables\Facades\DataTables;
use Artesaos\SEOTools\Traits\SEOTools as SEOToolsTrait;

class DashboardController extends Controller
{
    use SEOToolsTrait;
    public function index()
    {
        $this->seo()->setTitle('Dashboard');
        $this->seo()->setDescription('This is my page description 1');
        $this->seo()->opengraph()->setUrl('http://current.url.com');
        $this->seo()->opengraph()->addProperty('type', 'articles');
        $this->seo()->twitter()->setSite('@mhdiorevansa098');
        $this->seo()->jsonLd()->setType('Article');
        $data['web'] = ['title' => 'Dashboard'];
        return view('index', $data);
    }

    public function getBarang()
    {
        $data = Barang::select(['id', 'nama_barang', 'harga_barang', 'created_at'])
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'asc');
        $datatable = DataTables::eloquent($data)
            ->editColumn('id', function ($data) {
                return Crypt::encryptString($data->id);
            })
            ->addIndexColumn()
            ->make(true);
        return $datatable;
    }

    public function postBarang(Request $request)
    {
        $messages = [
            'nama_barang.required' => 'nama barang wajib diisi',
            'harga_barang.required' => 'harga barang wajib diisi',
            'harga_barang.max' => 'harga barang maksimal :max digit'
        ];
        $request->validate([
            'nama_barang' => 'required',
            'harga_barang' => 'required|max:10'
        ], $messages);
        $data = $request->all();
        try {
            DB::beginTransaction();
            Barang::create($data);
            DB::commit();
            $response = [
                'status' => 'success',
                'message' => 'Sukses menambahkan data barang'
            ];
        } catch (\Throwable $th) {
            DB::rollBack();
            $response = [
                'status' => 'error',
                'message' => 'Gagal menambahkan data barang',
                'error' => $th->getMessage(),
            ];
        }
        return response()->json($response);
    }

    public function editBarang($id)
    {
        try {
            $dcryptId = Crypt::decryptString($id);
            $data = Barang::select('nama_barang', 'harga_barang')->where('id', $dcryptId)->firstOrFail();
            $response = [
                'status' => 'success',
                'message' => 'barang loaded successfully',
                'data' => $data
            ];
        } catch (\Throwable $th) {
            $response = [
                'status' => 'error',
                'message' => 'Sepertinya ada masalah',
                'error' => $th->getMessage()
            ];
        }
        return response()->json($response);
    }

    public function updateBarang($id, Request $request)
    {
        $messages = [
            'nama_barang.required' => 'nama barang wajib diisi',
            'harga_barang.required' => 'harga barang wajib diisi',
            'harga_barang.max' => 'harga barang maksimal :max digit'
        ];
        $request->validate([
            'nama_barang' => 'required',
            'harga_barang' => 'required|max:10'
        ], $messages);
        try {
            $id = Crypt::decryptString($id);
            $data = Barang::findOrFail($id);
        } catch (\Throwable $th) {
            $response = [
                'status' => 'error',
                'message' => 'Data tidak ditemukan'
            ];
        }
        $dataToUpdate = $request->except('id');
        $dataToUpdate['harga_barang'] = str_replace(['.', ','], '', $request->input('harga_barang', 0));
        try {
            DB::beginTransaction();
            $data->update($dataToUpdate);
            DB::commit();
            $response = [
                'status' => 'success',
                'message' => 'Data berhasil di update'
            ];
        } catch (\Throwable $th) {
            DB::rollBack();
            $response = [
                'status' => 'error',
                'message' => 'Sepertinya ada masalah',
                'error' => $th->getMessage()
            ];
        }
        return response()->json($response);
    }

    public function deleteBarang($id)
    {
        $id = Crypt::decryptString($id);
        try {
            $data = Barang::findOrFail($id);
        } catch (\Throwable $th) {
            $response = [
                'status' => 'error',
                'message' => 'Data tidak ditemukan',
                'error' => $th->getMessage()
            ];
        }
        try {
            DB::beginTransaction();
            $data->delete();
            DB::commit();
            $response = [
                'status' => 'success',
                'message' => 'Data berhasil dihapus'
            ];
        } catch (\Throwable $th) {
            DB::rollBack();
            $response = [
                'status' => 'error',
                'message' => 'Sepertinya ada masalah',
                'error' => $th->getMessage()
            ];
        }
        return response()->json($response);
    }

    public function getAllUser()
    {
        try {
            $userActive = FacadesAuth::user();
            $users = User::where('id', '!=', $userActive->id)->get();
            $users = $users->map(function ($user) {
                return [
                    'id' => Crypt::encryptString($user->id),
                    'name' => $user->name,
                ];
            });            
            $response = [
                'status' => 'success',
                'message' => 'Data user berhasil di load',
                'data' => $users
            ];
        } catch (\Throwable $th) {
            $response = [
                'status' => 'error',
                'message' => 'Sepertinya ada masalah',
                'error' => $th->getMessage()
            ];
        }
        return response()->json($response);
    }

    public function getDataKampus(Request $request)
    {
        try {
            $path = resource_path('js/services/data/data-kampus.json');
            if (!file_exists($path)) {
                throw new Exception('File not found');
            }
            $data = json_decode(File::get($path), true);
            $page = $request->get('page', 1);
            $perPage = $request->get('perPage', 6);
            // menentukan data diambil dari indeks ke berapa
            $offset = ($page - 1) * $perPage;
            // slice data array, argumen pertama adalah datanya, argumen kedua adalah dimulai dari indeks ke berapa, argumen ketiga item yang diambil berapa
            $paginatedData = array_slice($data, $offset, $perPage);
            $response = [
                'status' => 'success',
                'message' => 'Data kampus berhasil di load',
                'data' => $paginatedData,
                'pagination' => [
                    'current_page' => (int) $page,
                    'per_page' => (int) $perPage,
                    'total' => count($data),
                    'last_page' => \ceil(count($data) / $perPage)
                ]
            ];
        } catch (\Throwable $th) {
            $response = [
                'status' => 'error',
                'message' => 'Sepertinya ada masalah',
                'error' => $th->getMessage()
            ];
        }
        return response()->json($response);
    }
}
