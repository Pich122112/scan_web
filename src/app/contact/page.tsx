export default function ContactPage() {
    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    📞 ទាក់ទងមកពួកយើង
                </h1>
                <p className="text-gray-600 mb-6">
                    សូមទាក់ទងតាមរយៈ <br />
                    Messenger / Email / Phone
                </p>
                <div className="space-y-3">
                    <a
                        href="https://m.me/yourpage"
                        target="_blank"
                        className="block bg-blue-500 text-white py-2 rounded-lg shadow hover:bg-blue-600 transition"
                    >
                        Messenger
                    </a>
                    <a
                        href="mailto:support@example.com"
                        className="block bg-green-500 text-white py-2 rounded-lg shadow hover:bg-green-600 transition"
                    >
                        support@example.com
                    </a>
                    <a
                        href="tel:+85512345678"
                        className="block bg-orange-500 text-white py-2 rounded-lg shadow hover:bg-orange-600 transition"
                    >
                        +855 12 345 678
                    </a>
                </div>
            </div>
        </main>
    );
}
