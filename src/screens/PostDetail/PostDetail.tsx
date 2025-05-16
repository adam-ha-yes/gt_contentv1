import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { MatrixRain } from '../../components/MatrixRain';
import { Dialog, DialogContent } from '../../components/ui/dialog';

export const PostDetail = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [queryInput, setQueryInput] = useState("");
  const [messages, setMessages] = useState<Array<{type: 'ai' | 'user', content: string}>>([]);
  const [content, setContent] = useState(
    "Moving back to NY next week, after 5 weeks in SF. I will write full thoughts on SF soon. But I'm so excited to be back. It's in my blood. I've missed the city more and more every day. And it's the right place to build Aura."
  );
  const [showRemixPopup, setShowRemixPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{top: number, left: number}>({top: 0, left: 0});
  const [selectedText, setSelectedText] = useState<string>("");
  const [scheduledAt, setScheduledAt] = useState("April 24 @ 7 AM");
  const [showScheduler, setShowScheduler] = useState(false);
  const [showMatrixRain, setShowMatrixRain] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [postUrl, setPostUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getText());
    },
    editorProps: {
      attributes: {
        class: 'w-full max-w-none focus:outline-none min-h-[100px] text-[15px] mt-1 text-foreground font-mono',
      },
    },
  });

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        // Only show popup if selection is inside the editor
        const editorEl = document.querySelector('.ProseMirror');
        const editorContainer = editorEl?.closest('.relative');
        if (editorEl && editorEl.contains(selection.anchorNode) && editorContainer) {
          const containerRect = editorContainer.getBoundingClientRect();
          setShowRemixPopup(true);
          setPopupPosition({
            top: rect.top - containerRect.top - 8,
            left: rect.left - containerRect.left + rect.width / 2
          });
          setSelectedText(selection.toString());
        } else {
          setShowRemixPopup(false);
          setSelectedText("");
        }
      } else {
        setShowRemixPopup(false);
        setSelectedText("");
      }
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        editor.chain().focus().setImage({ src: imageUrl }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    setIsPublished(true);
    // Simulate post URL generation
    const postUrl = `https://twitter.com/adam_ha_yes/status/${Date.now()}`;
    
    // Navigate back to dashboard with success state
    navigate('/', {
      state: {
        showSuccess: true,
        postUrl
      }
    });
  };

  const handleSaveAsDraft = () => {
    navigate('/', { 
      state: { 
        showDraftSuccess: true,
        activeTab: 'drafts'
      } 
    });
  };

  const handlePublishNow = () => {
    setShowMatrixRain(true);
    setTimeout(() => {
      setShowMatrixRain(false);
      setShowCongratsModal(true);
      setPostUrl(`https://twitter.com/adam_ha_yes/status/${Date.now()}`);
    }, 2500);
  };

  const handleCloseCongrats = () => {
    setShowCongratsModal(false);
    navigate('/', { state: { activeTab: 'ideas' } });
  };

  const tweets = [
    {
      id: 2,
      author: "Adam",
      username: "@adam_ha_yes",
      date: "Apr 24",
      content:
        "THIS APP IS AWESOME!\n\nFinch makes $2M/month, making self-care feel like raising a pet.\n\nForget boring habit trackers. They merged Tamagotchi nostalgia with mental wellness.\n\nResult? Insane engagement & revenue.\n\nHere's the breakdown",
      verified: true,
      hasVideo: true,
      showMore: true,
    },
    {
      id: 3,
      author: "Adam",
      username: "@adam_ha_yes",
      date: "Apr 24",
      content:
        "Moving back to NY next week, after 5 weeks in SF.\n\nI will write full thoughts on SF soon.\n\nBut I'm so excited to be back. It's in my blood. I've missed the city more and more every day.\n\nAnd it's the right place to build Aura.",
      verified: true,
      hasOverlay: true,
      schedule: true,
    },
    {
      id: 4,
      author: "Adam",
      username: "@adam_ha_yes",
      date: "Apr 24",
      content:
        "Moving back to NY next week, after 5 weeks in SF.\n\nI will write full thoughts on SF soon.\n\nBut I'm so excited to be back. It's in my blood. I've missed the city more and more every day.\n\nAnd it's the right place to build Aura.",
      verified: true,
    },
  ];

  return (
    <div className="bg-background flex flex-row justify-center w-full">
      <MatrixRain show={showMatrixRain} />
      <div className="bg-background overflow-hidden w-full max-w-[1602px] relative min-h-screen">
        {/* Main Content */}
        <div className="flex justify-center">
          {/* Main Content Area */}
          <div className="w-[900px] relative pr-[400px]">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 p-4">
              <Button 
                variant="ghost" 
                className="rounded-full w-10 h-10 p-0 text-foreground hover:bg-primary hover:text-background transition-colors"
                onClick={() => navigate('/')}
              >
                ←
              </Button>
              <h1 className="text-xl font-bold text-foreground">Thread</h1>
            </div>

            {/* Main Post */}
            <div className="border-b border-border pb-3 px-4">
              <div className="flex gap-3">
                <Avatar className="w-11 h-11">
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[15px] text-foreground">Adam</span>
                    <span className="text-muted-foreground">@adam_ha_yes</span>
                  </div>
                  <div className="relative">
                    <EditorContent editor={editor} />
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    {showRemixPopup && (
                      <div
                        style={{
                          position: 'absolute',
                          top: popupPosition.top - 8,
                          left: popupPosition.left,
                          transform: 'translate(-50%, -100%)',
                          zIndex: 50
                        }}
                        className="bg-muted text-foreground px-3 py-1.5 rounded-md shadow-lg flex items-center gap-2"
                      >
                        <span className="text-sm font-medium">Remix with AI</span>
                        <span className="absolute left-1/2 top-full -translate-x-1/2 block" style={{height: 0, width: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '8px solid hsl(var(--muted))'}}></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar for Actions */}
            <div className="fixed left-1/2 bottom-0 z-30 w-[900px] -translate-x-1/2 bg-background border-t border-border px-8 py-4 flex items-center justify-between shadow-lg">
              <Button 
                variant="outline"
                className="hover:bg-primary hover:text-primary-foreground"
                onClick={handleSaveAsDraft}
              >
                Save as Draft
              </Button>
              <div className="flex gap-3 ml-auto">
                <Button 
                  variant="outline"
                  className="hover:bg-primary hover:text-primary-foreground"
                  onClick={handlePublishNow}
                >
                  Publish Now
                </Button>
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handlePublish}
                >
                  Add to Queue
                </Button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - AI Assistant */}
          <div className="fixed right-0 top-0 h-full w-[400px] bg-[#0c0c0c] flex flex-col z-30 border-l border-[#1a1a1a]">
            {selectedText && (
              <div className="px-6 pt-6">
                <div className="bg-[#1a1a1a] rounded-xl p-4">
                  <div className="text-[#e4e4e7] text-[15px]">
                    <span className="text-[#4ade80] font-medium">Selected:</span>
                    <p className="mt-2 leading-relaxed">{selectedText}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-6 pt-6">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className="bg-[#1a1a1a] rounded-xl p-4">
                    <p className="text-[15px] text-[#e4e4e7] leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Query Box */}
            <div className="p-6 border-t border-[#1a1a1a]">
              <div className="relative">
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="What's your big idea?"
                  className="w-full px-5 py-4 bg-[#1a1a1a] rounded-xl text-[15px] text-[#e4e4e7] placeholder-[#404040] focus:outline-none focus:ring-1 focus:ring-[#4ade80] transition-shadow focus:shadow-[0_0_15px_rgba(74,222,128,0.1)]"
                />
                <div className="flex gap-3 mt-4 justify-between items-center">
                  <div className="flex gap-3">
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666666] hover:text-[#4ade80] hover:bg-[#1a1a1a] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                    </button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666666] hover:text-[#4ade80] hover:bg-[#1a1a1a] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3v18M3 12h18" />
                      </svg>
                    </button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666666] hover:text-[#4ade80] hover:bg-[#1a1a1a] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
                  </div>
                  {queryInput && (
                    <Button 
                      className="bg-[#4ade80] hover:bg-[#4ade80]/90 text-black font-medium rounded-lg h-8 px-4 transition-all duration-200" 
                      onClick={() => {
                        setMessages(prev => [...prev, 
                          { type: 'user', content: queryInput },
                          { type: 'ai', content: "I'll help you improve your thread to make it more engaging and impactful. Here are some suggestions..." }
                        ]);
                        setQueryInput('');
                      }}
                    >
                      Send
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={showCongratsModal} onOpenChange={setShowCongratsModal}>
        <DialogContent className="bg-[#18181b] border-[#4ade80] text-center max-w-md mx-auto">
          <div className="text-2xl font-bold text-[#4ade80] mb-2">You're live!</div>
          <div className="text-[#e4e4e7] mb-4">Your post is up and running.</div>
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-[#4ade80] text-black rounded-lg font-semibold hover:bg-[#22c55e] transition-colors mb-4"
          >
            Check it out
          </a>
          <Button className="w-full mt-2 bg-black border border-white text-white hover:bg-[#18181b] hover:text-white" onClick={handleCloseCongrats}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};