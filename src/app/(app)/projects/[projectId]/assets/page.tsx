"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr';
import {
  Loader2,
  AlertCircle,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Video,
  File,
  Link as LinkIcon,
  User,
  Download,
  CheckCircle,
  X,
} from 'lucide-react';

const CATEGORIES = [
  { key: "strategy", label: "Strategy Documents", icon: FileText },
  { key: "creative", label: "Creative Drafts", icon: ImageIcon },
  { key: "client", label: "Uploaded by Client", icon: User },
  { key: "final", label: "Final Deliverables", icon: CheckCircle },
];

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-blue-400" />;
  if (type.startsWith("video/")) return <Video className="h-5 w-5 text-purple-400" />;
  if (type === "application/pdf") return <FileText className="h-5 w-5 text-red-400" />;
  if (type.includes("word")) return <FileText className="h-5 w-5 text-blue-600" />;
  return <File className="h-5 w-5 text-gray-400" />;
}

export default function ProjectAssetsPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [client, setClient] = useState<{ name: string } | null>(null);
  const [project, setProject] = useState<{ project_name: string } | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].key);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState(CATEGORIES[0].key);

  const supabase = createBrowserClient(
    'https://mnnicdzpbfqjwtvbykry.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubmljZHpwYmZxand0dmJ5a3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNjkyODAsImV4cCI6MjA2Nzc0NTI4MH0.G46t1BlaBAxIZ9hhpkEbUEOBqDQGASn-Poh4OS11h8o'
  );

  // Placeholder: Assume current user is agency
  const currentUser = { id: "agency-1", name: "Jacob Long", role: "agency" };

  useEffect(() => {
    const fetchProjectAndClient = async () => {
      try {
        setLoading(true);
        const { data: projectData } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
        setProject(projectData);
        if (projectData) {
          const { data: clientData } = await supabase
            .from('clients')
            .select('*')
            .eq('id', projectData.client_id)
            .single();
          setClient(clientData);
        }
      } catch (err) {
        // ignore
      }
    };
    fetchProjectAndClient();
  }, [projectId]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const { data: filesData, error: filesError } = await supabase
          .from('assets')
          .select('*')
          .eq('project_id', projectId)
          .order('uploaded_at', { ascending: false });
        if (filesError) throw filesError;
        setFiles(filesData || []);
      } catch (err) {
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [projectId, uploading, showModal]);

  const handleFileChange = (e: any) => {
    setSelectedFile(e.target.files[0] || null);
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    setUploadError(null);
    try {
      // Upload to Supabase Storage (bucket: 'project-assets')
      const filePath = `${projectId}/${uploadCategory}/${Date.now()}-${selectedFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-assets')
        .upload(filePath, selectedFile);
      if (uploadError) throw uploadError;
      // Insert metadata into 'assets' table
      const { error: metaError } = await supabase.from('assets').insert([
        {
          project_id: projectId,
          file_name: selectedFile.name,
          file_type: selectedFile.type,
          file_url: uploadData?.path,
          category: uploadCategory,
          uploader_id: currentUser.id,
          uploader_name: currentUser.name,
          uploaded_at: new Date().toISOString(),
        },
      ]);
      if (metaError) throw metaError;
      setShowModal(false);
      setSelectedFile(null);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Assets & Uploads</h1>
        <p className="text-gray-600 text-sm mb-2">Share creative drafts, strategy docs, and final files.</p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="font-semibold">{project?.project_name}</span>
          <span>·</span>
          <span>Client: {client?.name}</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${activeCategory === cat.key ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
            >
              <Icon className="h-4 w-4" /> {cat.label}
            </button>
          );
        })}
      </div>

      {/* Asset List for Active Category */}
      <div className="bg-white border rounded-lg shadow-sm p-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">{CATEGORIES.find(c => c.key === activeCategory)?.label}</h2>
          <button
            onClick={() => { setShowModal(true); setUploadCategory(activeCategory); }}
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <UploadCloud className="h-4 w-4 mr-2" /> Upload
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
            <span className="text-gray-500 ml-2">Loading files…</span>
          </div>
        ) : files.filter(f => f.category === activeCategory).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-8 w-8 text-blue-400 mb-2" />
            <span className="text-gray-500 text-center">No {CATEGORIES.find(c => c.key === activeCategory)?.label?.toLowerCase()} uploaded yet. Drop your files here.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {files.filter(f => f.category === activeCategory).map((file) => (
              <div key={file.id} className="bg-gray-50 rounded-lg border p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition group">
                <div className="flex items-center gap-2">
                  {getFileIcon(file.file_type)}
                  <span className="font-semibold text-gray-800 truncate" title={file.file_name}>{file.file_name}</span>
                </div>
                <div className="text-xs text-gray-500">Uploaded {new Date(file.uploaded_at).toLocaleDateString()} by {file.uploader_name}</div>
                <div className="flex gap-2 mt-2">
                  <a
                    href={file.file_url ? supabase.storage.from('project-assets').getPublicUrl(file.file_url).data.publicUrl : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-medium"
                  >
                    <Download className="h-4 w-4 mr-1" /> Download
                  </a>
                  {file.file_type.startsWith('image/') && file.file_url && (
                    <a
                      href={supabase.storage.from('project-assets').getPublicUrl(file.file_url).data.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs font-medium"
                    >
                      <ImageIcon className="h-4 w-4 mr-1" /> Preview
                    </a>
                  )}
                  {file.file_type.startsWith('video/') && file.file_url && (
                    <a
                      href={supabase.storage.from('project-assets').getPublicUrl(file.file_url).data.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs font-medium"
                    >
                      <Video className="h-4 w-4 mr-1" /> Preview
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">Upload File</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                <input
                  type="file"
                  className="w-full border rounded px-3 py-2"
                  required
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={uploadCategory}
                  onChange={e => setUploadCategory(e.target.value)}
                  disabled={uploading}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.key} value={cat.key}>{cat.label}</option>
                  ))}
                </select>
              </div>
              {uploadError && <div className="text-red-600 text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {uploadError}</div>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
                disabled={uploading || !selectedFile}
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" /> : null}
                Upload
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 