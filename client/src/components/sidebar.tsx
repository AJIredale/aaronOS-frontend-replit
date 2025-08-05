import AaronIcon from "@/components/aaron-icon";
import AgentStatus from "@/components/agent-status";
import { useAgentState } from "@/hooks/use-agent-state";
import aaronOSLogo from "@assets/aaron OS logo light@4x_1754411458932.png";

export default function Sidebar() {
  const { agentStatus } = useAgentState();

  return (
    <div className="w-64 bg-[var(--aaron-dark)] text-white flex flex-col border-r border-gray-800">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <img 
            src={aaronOSLogo} 
            alt="AaronOS" 
            className="h-6 w-auto"
          />
        </div>
      </div>

      {/* Agent Status */}
      <div className="p-4">
        <AgentStatus />
      </div>
      
      {/* User Profile */}
      <div className="flex-1 flex items-end p-4">
        <div className="w-full">
          <div className="bg-gray-700 rounded-lg p-3 relative group">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium">User</div>
                <div className="text-gray-400 text-xs truncate">user@aaronos.com</div>
              </div>
              <div className="text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Dropdown Menu */}
            <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  System
                </button>
                <hr className="my-2" />
                <button className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
