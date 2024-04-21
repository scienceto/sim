# Use the official Node.js 20 image as the base image
FROM public.ecr.aws/lambda/nodejs:20

# Copy package.json and package-lock.json to the working directory
COPY package*.json ${LAMBDA_TASK_ROOT}

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . ${LAMBDA_TASK_ROOT}

# # Expose the port on which the application will run
# EXPOSE 5000

# Start the application
CMD [ "index.handler" ]