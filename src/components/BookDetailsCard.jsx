import React from 'react';
import { Book, User, DollarSign, Tag, FileText, Paperclip, Star, BookOpen } from "lucide-react";

export const BookDetailsCard = ({ details, title, icon }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden p-6">
      <h6 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h6>
      <div className="grid grid-cols-2 gap-4">
        {details.map((detail, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl"
          >
            <div className="p-2 bg-white rounded-lg">
              {detail.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{detail.label}</p>
              <p className="font-medium text-gray-800">{detail.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};