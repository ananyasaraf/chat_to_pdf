import FileUploadComponent from "./components/file-upload";
import ChatComponent from "./components/chat";
export default function Home() {
  return (
  <div className="w-screen h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
  {/* Left Panel - Upload */}
  <div className="md:w-[30%] w-full p-6 bg-gray-800 shadow-2xl border-b md:border-b-0 md:border-r border-gray-700 flex flex-col items-center justify-start">
    <div className="text-center mb-6">
      <h2 className="text-3xl font-bold mb-2 text-blue-400 flex items-center justify-center gap-2">
        <span className="text-white">📄</span> PDF AI Assistant
      </h2>
      <p className="text-sm text-gray-300">Upload documents and chat with their content</p>
    </div>
    
    <FileUploadComponent />
    
    {/* Recent files section */}
    <div className="w-full mt-8">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">RECENT FILES</h3>
      <div className="space-y-2">
        {[].length > 0 ? (
          // Map through recent files here
          <div className="text-center text-gray-500 text-sm">
            No recent files
          </div>
        ) : (
          <div className="text-center text-gray-500 text-sm">
            Your recently opened files will appear here
          </div>
        )}
      </div>
    </div>
  </div>

  {/* Right Panel - Chat */}
  <div className="md:w-[70%] w-full h-full flex flex-col bg-gray-900">
    <ChatComponent />
  </div>
</div>
  );
}
