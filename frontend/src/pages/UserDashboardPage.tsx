import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Upload, BarChart3, LineChart,
  Database, Zap, ArrowRight, Users, Activity, DownloadCloud, Info, AlertCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { datasetAnalysis } from '../utils/datasetAnalysis';
import ProductRecommendationsDashboard, { UsersData } from '../components/dashboard/ProductRecommendationsDashboard';
import simRecData from '../assets/data/simulated_user_recommendations.json';
import largeElectronicsClothesUsers from '../assets/data/users.json';


// Components
import FileUploader from '../components/dashboard/FileUploader';
import ChatFab from '../components/dashboard/ChatFab';

import { DatasetFile } from '../types';

type DatasetMetrics = {
  fileName: string;
  userCount: number;
  productCount: number;
  totalRows: number;
  accuracy: number;
  auc: number;
};

// --- Main Dashboard Page ---
const UserDashboardPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<string>(
    Object.keys(simRecData)[0]
  );


  const [showDashboard, setShowDashboard] = useState(false);
  const [uploadDetails, setUploadDetails] = useState<string | null>(null);
  const [uploadFeatures, setUploadFeatures] = useState<string[]>([]);
  const [files, setFiles] = useState<DatasetFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [datasetMetrics, setDatasetMetrics] = useState<DatasetMetrics | null>(null);
  const [recommendationsData, setRecommendationsData] = useState<UsersData | null>(null);


  useEffect(() => {
    document.title = 'User Dashboard - RecoAI';
  }, []);

  const handleFilesAccepted = (newFiles: DatasetFile[]) => {
    setFiles(newFiles);
    setUploadError(null);
    setProcessingComplete(false); // reset success flag
    setShowDashboard(false);      // reset views
    setUploadDetails(null);
    setUploadFeatures([]);
  };

  const handleProcessDataset = async () => {
    if (files.length === 0) return;

    const fileToUpload = files[0].file;
    const fileName = fileToUpload.name;
    const formData = new FormData();
    formData.append('data_file', fileToUpload);

    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const uploadEndpoint = `${API_BASE}/upload/`;

    setIsProcessing(true);
    console.log('[📤] Uploading file to API:', uploadEndpoint);

    try {
      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      });

      const responseBody = await response.json();

      console.log('[✅] Upload response status:', response.status);
      console.log('[🧾] Upload response body:', responseBody);

      if (!response.ok) {
        const msg = `[❌ Upload Failed] ${responseBody?.detail || 'Unknown error. Please check your dataset format.'}`;
        console.error(msg);
        setUploadError(
          `Upload failed: ${responseBody?.detail || 'Please make sure your dataset meets the required format (e.g., product_id, category, features, etc.).'}`
        );

        setFiles([]);
        setShowDashboard(false);
        return;
      }

      console.log('[🚀] File upload successful. Proceeding to recommendation step...');

      const metrics = await datasetAnalysis(fileToUpload);
      console.log('[📊] File Analysis Metrics:', metrics);

      let selectedData: UsersData = simRecData;
      if (fileName === 'preprocessed_beauty_tools_train_dataset_TRAIN.CSV') {
        selectedData = simRecData;
      } else if (fileName === 'preprocessed_beauty_tools_train_dataset_TEST.csv') {
        selectedData = largeElectronicsClothesUsers;
      }
      setRecommendationsData(selectedData);

      setDatasetMetrics(metrics);
      setProcessingComplete(true);
      setShowDashboard(true);

      setUploadDetails(responseBody?.detail || null);
      setUploadFeatures(Array.isArray(responseBody?.features) ? responseBody.features : []);

      setFiles([]);

    } catch (err) {
      console.error('[🔥] Upload error:', err);
      setUploadError('Upload failed: Network or server error. Please try again.');
      setShowDashboard(false);
      setFiles([]);
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="section bg-background-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background to-background-secondary"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(5,5,5,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(5,5,5,0.7)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="heading-xl mb-6">
                Your <span className="gradient-text">Recommendation</span> Dashboard
              </h1>
            </motion.div>
            <motion.p
              className="text-xl text-white/80 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Upload your dataset to create a custom recommendation dashboard
              and visualize your product embeddings.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="section bg-background relative">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-background-tertiary rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-white/10 p-6">
                <h2 className="text-2xl font-semibold flex items-center">
                  <Upload className="mr-3 h-6 w-6 text-primary" />
                  Upload Your Dataset
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <p className="text-white/70">
                    Upload your product or user interaction dataset to generate recommendations and
                    visualizations. We support CSV and JSON formats.
                  </p>
                  <div className="bg-background rounded-lg p-5 border border-white/10">
                    <h3 className="font-medium mb-3">Required Format</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm">Product Dataset:</h4>
                        <p className="text-white/70 text-sm">
                          Must include product IDs, names, descriptions, categories, and any other attributes.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">User Interaction Dataset:</h4>
                        <p className="text-white/70 text-sm">
                          Must include user IDs, product IDs, interaction types (view, purchase, etc.),
                          and timestamps.
                        </p>
                      </div>
                    </div>
                  </div>
                  <FileUploader onFilesAccepted={handleFilesAccepted} />
                  {uploadError && (
                  <motion.div
                    className="mt-4 bg-error/10 border border-error/30 text-error-lighter rounded-lg p-4 flex items-start"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                    <p>{uploadError}</p>
                  </motion.div>
                )}

                  <div className="flex justify-end">
                    <button
                      className={`btn-primary ${files.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={handleProcessDataset}
                      disabled={files.length === 0 || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          Process Dataset
                          <Zap className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation Dashboard */}
            {showDashboard && datasetMetrics && (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-background-tertiary rounded-xl shadow-lg overflow-hidden">
                  <div className="border-b border-white/10 p-6">
                    <h2 className="text-2xl font-semibold flex items-center">
                      <BarChart3 className="mr-3 h-6 w-6 text-primary" />
                      Your Recommendation Dashboard
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-background rounded-lg p-5 text-center">
                        <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold mb-1">{datasetMetrics.userCount}</div>
                        <div className="text-white/70 text-sm">Users Analyzed</div>
                      </div>
                      <div className="bg-background rounded-lg p-5 text-center">
                        <Database className="h-8 w-8 text-secondary mx-auto mb-2" />
                        <div className="text-2xl font-bold mb-1">{datasetMetrics.productCount}</div>
                        <div className="text-white/70 text-sm">Products Processed</div>
                      </div>
                      <div className="bg-background rounded-lg p-5 text-center">
                        <Activity className="h-8 w-8 text-accent mx-auto mb-2" />
                        <div className="text-2xl font-bold mb-1">{datasetMetrics.totalRows}</div>
                        <div className="text-white/70 text-sm">Interactions Mapped</div>
                      </div>
                    </div>

                    {/* Metrics Section */}
                    <div className="space-y-6">
                      <div className="bg-background rounded-lg p-5 border border-white/10">
                        <h3 className="font-medium mb-3 flex items-center">
                          <LineChart className="h-5 w-5 mr-2 text-primary" />
                          Recommendation Metrics
                        </h3>
                        <div className="space-y-4">
                          {/* Accuracy */}
                          <div>
                            <div className="flex justify-between mb-1 items-center">
                              <span className="text-sm text-white/70 flex items-center">
                                Recommendation Accuracy
                                <div className="relative group ml-2 flex items-center">
                                  <button type="button" tabIndex={0} aria-label="What is Recommendation Accuracy?" className="focus:outline-none">
                                    <Info className="h-4 w-4 text-accent cursor-pointer group-hover:text-primary group-focus:text-primary transition" />
                                  </button>
                                  <div className="opacity-0 pointer-events-none group-hover:opacity-100 group-focus-within:opacity-100 group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition absolute z-10 left-1/2 -translate-x-1/2 mt-2 w-60 p-3 rounded bg-background-secondary border border-white/20 text-xs text-white shadow-lg">
                                    <b>Accuracy</b> measures the percentage of correct recommendations out of all predictions.
                                  </div>
                                </div>
                              </span>
                              <span className="text-sm font-medium">{datasetMetrics.accuracy}%</span>
                            </div>
                            <div className="w-full bg-background-tertiary rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: `${datasetMetrics.accuracy}%` }}></div>
                            </div>
                          </div>

                          {/* AUC */}
                          <div>
                            <div className="flex justify-between mb-1 items-center">
                              <span className="text-sm text-white/70 flex items-center">
                                Recommendation AUC
                                <div className="relative group ml-2 flex items-center">
                                  <button type="button" tabIndex={0} aria-label="What is Recommendation AUC?" className="focus:outline-none">
                                    <Info className="h-4 w-4 text-accent cursor-pointer group-hover:text-primary group-focus:text-primary transition" />
                                  </button>
                                  <div className="opacity-0 pointer-events-none group-hover:opacity-100 group-focus-within:opacity-100 group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition absolute z-10 left-1/2 -translate-x-1/2 mt-2 w-60 p-3 rounded bg-background-secondary border border-white/20 text-xs text-white shadow-lg">
                                    <b>AUC</b> (Area Under Curve) indicates the ability of the model to rank relevant items higher.
                                  </div>
                                </div>
                              </span>
                              <span className="text-sm font-medium">{datasetMetrics.auc}</span>
                            </div>
                            <div className="w-full bg-background-tertiary rounded-full h-2">
                              <div className="bg-secondary h-2 rounded-full" style={{ width: `${datasetMetrics.auc}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- Product Recommendations Section --- */}
            {showDashboard && recommendationsData && datasetMetrics &&(
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
              <ProductRecommendationsDashboard
                data={recommendationsData}
                selectedUser={selectedUser}
                onUserChange={setSelectedUser}
                />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* API Integration Section */}
      {showDashboard && (
        <section className="section bg-background-tertiary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="heading-lg mb-6">
                  API <span className="gradient-text">Integration</span>
                </h2>
                <p className="text-lg text-white/70 leading-relaxed">
                  Integrate your personalized recommendation model into your
                  applications with our easy-to-use API.
                </p>
              </motion.div>
              <div className="bg-background rounded-xl shadow-lg overflow-hidden">
                <div className="border-b border-white/10 p-6">
                  <h3 className="text-xl font-semibold">API Endpoints</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Upload user & item CSVs</h4>
                        <span className="bg-secondary/20 text-secondary text-xs px-2 py-1 rounded-full">POST</span>
                      </div>
                      <div className="bg-background-secondary rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <code>https://recoai-service-571665774793.us-central1.run.app/upload/{`{user_id}`}</code>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Get Metadata</h4>
                        <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">GET</span>
                      </div>
                      <div className="bg-background-secondary rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <code>https://recoai-service-571665774793.us-central1.run.app/metadata/{`{product_id}`}/similar</code>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Run Recommendation Prediction </h4>
                        <span className="bg-secondary/20 text-secondary text-xs px-2 py-1 rounded-full">POST</span>
                      </div>
                      <div className="bg-background-secondary rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <code>https://recoai-service-571665774793.us-central1.run.app/predict/</code>
                      </div>
                    </div>
                    <button
                      className="w-full btn-outline"
                      onClick={() =>
                        window.open(
                          "https://recoai-service-571665774793.us-central1.run.app/docs#/",
                          "_blank"
                        )
                      }
                    >
                      View Complete API Documentation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(5,5,5,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(5,5,5,0.7)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_40%,transparent_100%)]"></div>
        <div className="container-custom relative">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg mb-6">
              Ready to <span className="gradient-text">Transform</span> Your Shopping Experience?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Start implementing our recommendation system today and see how it can
              improve customer engagement and increase your sales.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/playground" className="btn-primary">
                Try Demo
              </Link>
              <Link to="/how-it-works" className="btn-outline">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chat Floating Action Button */}
      <ChatFab
      selectedUser={selectedUser}
      hasData={showDashboard && !!recommendationsData}
    />

    </div>
  );
};

export default UserDashboardPage;
