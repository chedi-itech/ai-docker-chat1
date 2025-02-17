import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Doctor Symptom Checker</h1>
          <p className="text-gray-600">
            Describe your symptoms in Thai or English, and I&apos;ll help assess your condition
          </p>
        </header>
        <ChatInterface />
      </div>
    </div>
  );
}