
import React, { useState } from 'react';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { Contact } from '../types';

interface EditRemarkTagsProps {
  contact: Contact;
  onBack: () => void;
  onSave: (remark: string, tags: string[]) => void;
}

const PRESET_TAGS = ['朋友', '家人', '同事', '客户', '同学'];

const EditRemarkTags: React.FC<EditRemarkTagsProps> = ({ contact, onBack, onSave }) => {
  const [remark, setRemark] = useState(contact.remark || '');
  const [tags, setTags] = useState<string[]>(contact.tags || []);
  const [newTag, setNewTag] = useState('');

  const toggleTag = (t: string) => {
    if (tags.includes(t)) {
      setTags(tags.filter(tag => tag !== t));
    } else {
      setTags([...tags, t]);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag)) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  return (
    <div className="absolute inset-0 z-[120] bg-[#EDEDED] flex flex-col overflow-y-auto no-scrollbar">
      <header className="sticky top-0 z-10 bg-[#EDEDED] p-4 flex items-center justify-between border-b border-gray-200 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center gap-4">
          <ArrowLeft size={24} onClick={onBack} className="cursor-pointer" />
          <h1 className="text-lg font-semibold">设置备注和标签</h1>
        </div>
        <button 
          onClick={() => onSave(remark, tags)}
          className="bg-[#07C160] text-white px-4 py-1.5 rounded font-bold text-sm"
        >
          完成
        </button>
      </header>

      <div className="p-4 space-y-6">
        <div>
          <label className="text-sm text-gray-500 mb-2 block">备注名</label>
          <div className="bg-white rounded px-4 py-2 border border-gray-100">
            <input 
              type="text" 
              value={remark} 
              onChange={e => setRemark(e.target.value)} 
              placeholder="添加备注名"
              className="w-full text-[15px] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-2 block">标签</label>
          <div className="bg-white rounded p-4 border border-gray-100 space-y-4">
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <div key={tag} className="bg-green-50 text-[#07C160] border border-green-200 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {tag}
                  <X size={14} onClick={() => toggleTag(tag)} className="cursor-pointer" />
                </div>
              ))}
              <div className="flex-1 min-w-[100px]">
                <input 
                  type="text" 
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleAddTag()}
                  placeholder="添加标签..."
                  className="w-full text-sm outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRemarkTags;
