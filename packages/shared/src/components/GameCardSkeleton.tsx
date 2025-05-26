import React from 'react';
import { motion } from 'framer-motion';

const shimmerVariants = {
  initial: {
    backgroundPosition: '-500px 0',
  },
  animate: {
    backgroundPosition: '500px 0',
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear",
    },
  },
};

const skeletonBaseStyle = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '1000px 100%',
};

export const GameCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <motion.div
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={skeletonBaseStyle}
          className="h-4 w-24 rounded"
        />
        <motion.div
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={skeletonBaseStyle}
          className="h-4 w-32 rounded"
        />
      </div>

      <div className="space-y-4">
        {[0, 1].map((index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={skeletonBaseStyle}
              className="w-8 h-8 rounded-full"
            />
            <motion.div
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={skeletonBaseStyle}
              className="h-4 w-32 rounded"
            />
            <motion.div
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={skeletonBaseStyle}
              className="h-6 w-8 rounded ml-auto"
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={skeletonBaseStyle}
            className="h-4 w-24 rounded"
          />
          <motion.div className="flex space-x-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={skeletonBaseStyle}
                className="h-10 w-16 rounded"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 