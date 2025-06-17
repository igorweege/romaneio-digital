// app/sucesso/page.tsx
export default function SuccessPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center p-10 bg-white rounded-lg shadow-xl">
                <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h1 className="mt-4 text-2xl font-bold text-gray-800">Operação Concluída com Sucesso!</h1>
                <p className="mt-2 text-gray-600">O documento foi assinado. Obrigado.</p>
            </div>
        </div>
    );
}